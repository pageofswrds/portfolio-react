"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { logger } from "@/lib/logger";

// Types
export interface Cell {
  id: string;
  row: number;
  col: number;
  accessions: number;
  families: number;
  species: number;
  zscoreA: number;
  zscoreF: number;
  zscoreS: number;
  diversity: number;
  percentage: number;
  percentageU: number;
  uniqueFamilies: string[];
  uniqueSpecies: string[];
  rodHeight: number;
  blocks: number;
}

export interface Accession {
  accession: string; // Unique identifier for the plant accession
  cell: string; // Grid cell ID where this accession is located
  species: string; // Species name
  family: string; // Family name
}

export interface FilterConfig {
  type: "ALL" | "FAMILY" | "SPECIES" | "MULTIPLE_SPECIES";
  value: string;
  values?: string[]; // For multiple species selection
}

export interface ComputeConfig {
  metric:
    | "ALL"
    | "FAMILY"
    | "SPECIES"
    | "Z-SCORE"
    | "Z-SCORE-UNIQUE"
    | "DIVERSITY"
    | "PERCENTAGE";
}

export interface Statistics {
  totalAccessions: number;
  meanA: number;
  meanF: number;
  meanS: number;
  stdDevA: number;
  stdDevF: number;
  stdDevS: number;
  filledCells: number;
  minValues: Record<ComputeConfig["metric"], number>;
  maxValues: Record<ComputeConfig["metric"], number>;
}

interface ArboretumState {
  cellData: Cell[];
  selectedCell: Cell | null;
  filterConfig: FilterConfig;
  computeConfig: ComputeConfig;
  statistics: Statistics;
  blockHeights: string;
  species: string[];
  families: string[];
  isLoading: boolean;
  accessions: Accession[]; // Add accessions to state
}

interface ArboretumContextType extends ArboretumState {
  setFilter: (config: FilterConfig) => void;
  setCompute: (config: ComputeConfig) => void;
  selectCell: (cell: Cell | null) => void;
  setBlockHeights: (height: string) => void;
}

// Context
const ArboretumContext = createContext<ArboretumContextType | undefined>(
  undefined
);

// Hook to use the context
export const useArboretum = () => {
  const context = useContext(ArboretumContext);
  if (context === undefined) {
    throw new Error("useArboretum must be used within an ArboretumProvider");
  }
  return context;
};

// Utility functions
const getCellRow = (id: string): number => {
  const str = id.split("-")[0];
  let row: number;
  if (str.includes("S")) {
    row = Number(str.substring(0, 1));
  } else {
    row = 0 - Number(str);
  }
  return row + 50;
};

const getCellCol = (id: string): number => {
  const str = id.split("-")[1];
  let col: number;
  if (str.includes("W")) {
    col = 0 - Number(str.substring(0, 1));
  } else if (str.includes("E")) {
    col = Number(str.substring(0, 1));
  } else {
    col = 0;
  }
  return col + 7;
};

const createEmptyCell = (cellId: string): Cell => ({
  id: cellId,
  row: getCellRow(cellId),
  col: getCellCol(cellId),
  accessions: 0,
  families: 0,
  species: 0,
  zscoreA: 0,
  zscoreF: 0,
  zscoreS: 0,
  diversity: 0,
  percentage: 0,
  percentageU: 0,
  uniqueFamilies: [],
  uniqueSpecies: [],
  rodHeight: 0,
  blocks: 0,
});

const clearCellData = (cell: Cell): Cell => ({
  ...cell,
  accessions: 0,
  families: 0,
  species: 0,
  zscoreA: 0,
  zscoreF: 0,
  zscoreS: 0,
  diversity: 0,
  percentage: 0,
  percentageU: 0,
  uniqueFamilies: [],
  uniqueSpecies: [],
  rodHeight: 0,
  blocks: 0,
});

// Provider component
export const ArboretumProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ArboretumState>({
    cellData: [],
    selectedCell: null,
    filterConfig: { type: "ALL", value: "" },
    computeConfig: { metric: "ALL" },
    statistics: {
      totalAccessions: 0,
      meanA: 0,
      meanF: 0,
      meanS: 0,
      stdDevA: 0,
      stdDevF: 0,
      stdDevS: 0,
      filledCells: 0,
      minValues: {
        ALL: 0,
        FAMILY: 0,
        SPECIES: 0,
        "Z-SCORE": 0,
        "Z-SCORE-UNIQUE": 0,
        DIVERSITY: 0,
        PERCENTAGE: 0,
      },
      maxValues: {
        ALL: 0,
        FAMILY: 0,
        SPECIES: 0,
        "Z-SCORE": 0,
        "Z-SCORE-UNIQUE": 0,
        DIVERSITY: 0,
        PERCENTAGE: 0,
      },
    },
    blockHeights: "ALL",
    species: [],
    families: [],
    isLoading: true,
    accessions: [], // Initialize empty accessions array
  });

  const isInitialized = useRef(false);

  const shouldIncludeAccession = useCallback(
    (accession: Accession, filter: FilterConfig): boolean => {
      switch (filter.type) {
        case "FAMILY":
          return accession.family === filter.value;
        case "SPECIES":
          return accession.species === filter.value;
        case "MULTIPLE_SPECIES":
          return filter.values
            ? filter.values.includes(accession.species)
            : false;
        case "ALL":
        default:
          return true;
      }
    },
    []
  );

  const computeData = useCallback(() => {
    setState((prev) => {
      const updatedCellData = prev.cellData.map(clearCellData);

      // Apply filter and compute cell data
      for (const accession of prev.accessions) {
        const cell = updatedCellData.find((c) => c.id === accession.cell);
        if (!cell) continue;

        const shouldInclude = shouldIncludeAccession(
          accession,
          prev.filterConfig
        );
        if (!shouldInclude) continue;

        // Update cell data
        cell.accessions++;

        if (!cell.uniqueFamilies.includes(accession.family)) {
          cell.uniqueFamilies.push(accession.family);
          cell.families++;
        }

        if (!cell.uniqueSpecies.includes(accession.species)) {
          cell.uniqueSpecies.push(accession.species);
          cell.species++;
        }
      }

      // Calculate statistics and z-scores
      const filledCells = updatedCellData.filter((cell) => cell.accessions > 0);
      const totalAccessions = updatedCellData.reduce(
        (sum, cell) => sum + cell.accessions,
        0
      );

      // Calculate means
      const meanA =
        filledCells.reduce((sum, cell) => sum + cell.accessions, 0) /
          filledCells.length || 0;
      const meanF =
        filledCells.reduce((sum, cell) => sum + cell.families, 0) /
          filledCells.length || 0;
      const meanS =
        filledCells.reduce((sum, cell) => sum + cell.species, 0) /
          filledCells.length || 0;

      // Calculate standard deviations
      const stdDevA = Math.sqrt(
        filledCells.reduce(
          (sum, cell) => sum + Math.pow(cell.accessions - meanA, 2),
          0
        ) / filledCells.length || 0
      );
      const stdDevF = Math.sqrt(
        filledCells.reduce(
          (sum, cell) => sum + Math.pow(cell.families - meanF, 2),
          0
        ) / filledCells.length || 0
      );
      const stdDevS = Math.sqrt(
        filledCells.reduce(
          (sum, cell) => sum + Math.pow(cell.species - meanS, 2),
          0
        ) / filledCells.length || 0
      );

      // Calculate z-scores and other metrics
      let minZA = Infinity,
        maxZA = -Infinity;
      let minZU = Infinity,
        maxZU = -Infinity;

      for (const cell of updatedCellData) {
        if (cell.accessions > 0) {
          cell.zscoreA = stdDevA > 0 ? (cell.accessions - meanA) / stdDevA : 0;
          cell.zscoreF = stdDevF > 0 ? (cell.families - meanF) / stdDevF : 0;
          cell.zscoreS = stdDevS > 0 ? (cell.species - meanS) / stdDevS : 0;
          cell.diversity =
            cell.accessions > 0
              ? (cell.families + cell.species) / (cell.accessions * 2)
              : 0;

          const avgZscoreU = (cell.zscoreF + cell.zscoreS) / 2;

          minZA = Math.min(minZA, cell.zscoreA);
          maxZA = Math.max(maxZA, cell.zscoreA);
          minZU = Math.min(minZU, avgZscoreU);
          maxZU = Math.max(maxZU, avgZscoreU);

          cell.rodHeight = 0.1875 + (cell.accessions * 0.1875) / 5;
          cell.blocks = 1 + (cell.families + cell.species) / 10;
        }
      }

      // Calculate percentages
      for (const cell of updatedCellData) {
        if (cell.accessions > 0) {
          const avgZscoreU = (cell.zscoreF + cell.zscoreS) / 2;
          cell.percentage =
            maxZA > minZA
              ? (100 * (cell.zscoreA - minZA)) / (maxZA - minZA)
              : 0;
          cell.percentageU =
            maxZU > minZU ? (100 * (avgZscoreU - minZU)) / (maxZU - minZU) : 0;
        }
      }

      // Calculate min/max values for each metric
      const filledCellsOnly = updatedCellData.filter(
        (cell) => cell.accessions > 0
      );

      const minValues = {
        ALL:
          filledCellsOnly.length > 0
            ? Math.min(...filledCellsOnly.map((cell) => cell.accessions))
            : 0,
        FAMILY:
          filledCellsOnly.length > 0
            ? Math.min(...filledCellsOnly.map((cell) => cell.families))
            : 0,
        SPECIES:
          filledCellsOnly.length > 0
            ? Math.min(...filledCellsOnly.map((cell) => cell.species))
            : 0,
        "Z-SCORE":
          filledCellsOnly.length > 0
            ? Math.min(
                ...filledCellsOnly.map(
                  (cell) => (cell.zscoreA + cell.zscoreF + cell.zscoreS) / 3
                )
              )
            : 0,
        "Z-SCORE-UNIQUE":
          filledCellsOnly.length > 0
            ? Math.min(
                ...filledCellsOnly.map(
                  (cell) => (cell.zscoreF + cell.zscoreS) / 2
                )
              )
            : 0,
        DIVERSITY:
          filledCellsOnly.length > 0
            ? Math.min(...filledCellsOnly.map((cell) => cell.diversity))
            : 0,
        PERCENTAGE:
          filledCellsOnly.length > 0
            ? Math.min(...filledCellsOnly.map((cell) => cell.percentage))
            : 0,
      } as const;

      const maxValues = {
        ALL:
          filledCellsOnly.length > 0
            ? Math.max(...filledCellsOnly.map((cell) => cell.accessions))
            : 1,
        FAMILY:
          filledCellsOnly.length > 0
            ? Math.max(...filledCellsOnly.map((cell) => cell.families))
            : 1,
        SPECIES:
          filledCellsOnly.length > 0
            ? Math.max(...filledCellsOnly.map((cell) => cell.species))
            : 1,
        "Z-SCORE":
          filledCellsOnly.length > 0
            ? Math.max(
                ...filledCellsOnly.map(
                  (cell) => (cell.zscoreA + cell.zscoreF + cell.zscoreS) / 3
                )
              )
            : 1,
        "Z-SCORE-UNIQUE":
          filledCellsOnly.length > 0
            ? Math.max(
                ...filledCellsOnly.map(
                  (cell) => (cell.zscoreF + cell.zscoreS) / 2
                )
              )
            : 1,
        DIVERSITY:
          filledCellsOnly.length > 0
            ? Math.max(...filledCellsOnly.map((cell) => cell.diversity))
            : 1,
        PERCENTAGE:
          filledCellsOnly.length > 0
            ? Math.max(...filledCellsOnly.map((cell) => cell.percentage))
            : 1,
      } as const;

      return {
        ...prev,
        cellData: updatedCellData,
        statistics: {
          totalAccessions,
          meanA,
          meanF,
          meanS,
          stdDevA,
          stdDevF,
          stdDevS,
          filledCells: filledCells.length,
          minValues,
          maxValues,
        },
      };
    });
  }, [shouldIncludeAccession]);

  const initializeAndComputeData = useCallback(
    (accessions: Accession[]) => {
      const newCellData: Cell[] = [];
      const newSpecies: string[] = [];
      const newFamilies: string[] = [];

      // Extract unique cells, species, and families
      for (const accession of accessions) {
        if (!newCellData.find((cell) => cell.id === accession.cell)) {
          newCellData.push(createEmptyCell(accession.cell));
        }

        if (
          !newFamilies.includes(accession.family) &&
          accession.family &&
          accession.family.trim() !== ""
        ) {
          newFamilies.push(accession.family);
        }

        if (
          !newSpecies.includes(accession.species) &&
          accession.species &&
          accession.species.trim() !== ""
        ) {
          newSpecies.push(accession.species);
        }
      }

      // Set initial data
      setState((prev) => ({
        ...prev,
        cellData: newCellData,
        families: newFamilies.sort(),
        species: newSpecies.sort(),
        isLoading: false,
      }));

      // Trigger computation after state is set
      setTimeout(() => computeData(), 10);
    },
    [computeData]
  );

  // Load accessions data on mount
  useEffect(() => {
    const loadAccessions = async () => {
      try {
        const response = await fetch("/api/arboretum/accessions");
        const accessionsData = await response.json();

        setState((prev) => ({
          ...prev,
          accessions: accessionsData,
          isLoading: false,
        }));

        // Initialize data after loading
        if (!isInitialized.current) {
          initializeAndComputeData(accessionsData);
          isInitialized.current = true;
        }
      } catch (error) {
        logger.error("Failed to load accessions data:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadAccessions();
  }, [initializeAndComputeData]);

  // Initialize data on mount
  useEffect(() => {
    if (!isInitialized.current && state.accessions.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Data initialization is a legitimate use case
      initializeAndComputeData(state.accessions);
      isInitialized.current = true;
    }
  }, [state.accessions, initializeAndComputeData]);

  // Recompute data when filter changes
  useEffect(() => {
    if (isInitialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Data recomputation on filter change is a legitimate use case
      computeData();
    }
  }, [state.filterConfig, computeData]);

  const setFilter = (config: FilterConfig) => {
    setState((prev) => ({ ...prev, filterConfig: config }));
  };

  const setCompute = (config: ComputeConfig) => {
    setState((prev) => ({ ...prev, computeConfig: config }));
  };

  const selectCell = (cell: Cell | null) => {
    setState((prev) => ({ ...prev, selectedCell: cell }));
  };

  const setBlockHeights = (height: string) => {
    setState((prev) => ({ ...prev, blockHeights: height }));
  };

  return (
    <ArboretumContext.Provider
      value={{
        ...state,
        setFilter,
        setCompute,
        selectCell,
        setBlockHeights,
      }}
    >
      {children}
    </ArboretumContext.Provider>
  );
};
