// This file should handle computation, and bridge the gap between <ArboretumDataControls/> and <ArboretumVisualizer/>

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
  accession: string;
  cell: string;
  species: string;
  family: string;
}

export interface FilterConfig {
  type: "ALL" | "FAMILY" | "SPECIES";
  value: string;
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
    },
    blockHeights: "ALL",
    species: [],
    families: [],
    isLoading: true,
  });

  const isInitialized = useRef(false);

  const shouldIncludeAccession = useCallback(
    (accession: Accession, filter: FilterConfig): boolean => {
      switch (filter.type) {
        case "FAMILY":
          return accession.family === filter.value;
        case "SPECIES":
          return accession.species === filter.value;
        case "ALL":
        default:
          return true;
      }
    },
    []
  );

  const computeData = useCallback(async () => {
    // Load accessions data
    const response = await fetch("/data/accessions.json");
    const accessions = (await response.json()) as Accession[];

    setState((prev) => {
      const updatedCellData = prev.cellData.map(clearCellData);

      // Apply filter and compute cell data
      for (const accession of accessions) {
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
        },
      };
    });
  }, [shouldIncludeAccession]);

  const initializeData = useCallback(async () => {
    const response = await fetch("/data/accessions.json");
    const accessions = (await response.json()) as Accession[];

    const newCellData: Cell[] = [];
    const newSpecies: string[] = [];
    const newFamilies: string[] = [];

    // Extract unique cells, species, and families
    for (const accession of accessions) {
      if (!newCellData.find((cell) => cell.id === accession.cell)) {
        newCellData.push(createEmptyCell(accession.cell));
      }

      if (!newFamilies.includes(accession.family)) {
        newFamilies.push(accession.family);
      }

      if (!newSpecies.includes(accession.species)) {
        newSpecies.push(accession.species);
      }
    }

    setState((prev) => ({
      ...prev,
      cellData: newCellData,
      families: newFamilies.sort(),
      species: newSpecies.sort(),
      isLoading: false,
    }));
  }, []);

  // Initialize data on mount
  useEffect(() => {
    if (!isInitialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Data initialization is a legitimate use case
      initializeData();
      isInitialized.current = true;
    }
  }, [initializeData]);

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
