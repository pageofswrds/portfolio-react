"use client";

import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useArboretum } from "../lib/ArboretumProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Check,
  Xmark,
  FilterAlt,
  NavArrowDownSolid,
  NavArrowUpSolid,
  NavArrowRight,
  NavArrowDown,
} from "iconoir-react";

// Types for family and species data
interface FamilyData {
  name: string;
  accessionCount: number;
  species: SpeciesData[];
}

interface SpeciesData {
  name: string;
  accessionCount: number;
}

// Utility function to truncate text and determine if tooltip is needed
const truncateText = (
  text: string,
  maxLength: number = 20
): { text: string; isTruncated: boolean } => {
  if (text.length <= maxLength) {
    return { text, isTruncated: false };
  }
  return { text: text.substring(0, maxLength - 3) + "...", isTruncated: true };
};

// Custom cell component with tooltip for truncated text
const TruncatedCell: React.FC<{ text: string; maxLength?: number }> = ({
  text,
  maxLength = 20,
}) => {
  const { text: displayText, isTruncated } = truncateText(text, maxLength);

  if (isTruncated) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-default">{displayText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <span>{displayText}</span>;
};

// Filter state management types
interface FilterState {
  selectedFamilies: Set<string>;
  selectedSpecies: Set<string>;
}

// Accordion row component for nested family/species structure
interface AccordionRowProps {
  family: FamilyData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  searchText: string;
}

const AccordionRow: React.FC<AccordionRowProps> = ({
  family,
  isExpanded,
  onToggleExpanded,
  filterState,
  onFilterChange,
  searchText,
}) => {
  // Filter species based on search text
  const filteredSpecies = useMemo(() => {
    if (!searchText) return family.species;
    return family.species.filter((species) =>
      species.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [family.species, searchText]);

  // Check if family should be shown (either matches search or has matching species)
  const shouldShowFamily = useMemo(() => {
    if (!searchText) return true;
    return (
      family.name.toLowerCase().includes(searchText.toLowerCase()) ||
      filteredSpecies.length > 0
    );
  }, [family.name, searchText, filteredSpecies]);

  // Calculate checkbox state for family
  const getCheckboxState = useCallback(() => {
    const selectedSpeciesInFamily = family.species.filter((species) =>
      filterState.selectedSpecies.has(species.name)
    );

    if (selectedSpeciesInFamily.length === 0) {
      return "unchecked";
    } else if (selectedSpeciesInFamily.length === family.species.length) {
      return "checked";
    } else {
      return "indeterminate";
    }
  }, [family.species, filterState.selectedSpecies]);

  const handleFamilyToggle = useCallback(() => {
    const checkboxState = getCheckboxState();
    const newSelectedSpecies = new Set(filterState.selectedSpecies);

    if (checkboxState === "unchecked" || checkboxState === "indeterminate") {
      // Select all species in family
      family.species.forEach((species) => {
        newSelectedSpecies.add(species.name);
      });
    } else {
      // Unselect all species in family
      family.species.forEach((species) => {
        newSelectedSpecies.delete(species.name);
      });
    }

    onFilterChange({
      ...filterState,
      selectedSpecies: newSelectedSpecies,
    });
  }, [family.species, filterState, onFilterChange, getCheckboxState]);

  const handleSpeciesToggle = useCallback(
    (speciesName: string) => {
      const newSelectedSpecies = new Set(filterState.selectedSpecies);

      if (newSelectedSpecies.has(speciesName)) {
        newSelectedSpecies.delete(speciesName);
      } else {
        newSelectedSpecies.add(speciesName);
      }

      onFilterChange({
        ...filterState,
        selectedSpecies: newSelectedSpecies,
      });
    },
    [filterState, onFilterChange]
  );

  if (!shouldShowFamily) return null;

  const checkboxState = getCheckboxState();

  return (
    <>
      <TableRow
        className={`hover:bg-bg-hover cursor-pointer ${isExpanded ? "bg-bg-base" : ""}`}
        onClick={(e) => {
          // Check if click was on checkbox or its label
          const target = e.target as HTMLElement;
          const isCheckboxClick =
            target.closest('button[role="checkbox"]') ||
            target.closest("label") ||
            target.getAttribute("role") === "checkbox";

          if (!isCheckboxClick) {
            onToggleExpanded();
          }
        }}
      >
        <TableCell className="w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              className="px-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded();
              }}
              aria-label={isExpanded ? "Collapse family" : "Expand family"}
            >
              {isExpanded ? <NavArrowDown /> : <NavArrowRight />}
            </Button>
            <Checkbox
              checked={
                checkboxState === "checked"
                  ? true
                  : checkboxState === "indeterminate"
                    ? "indeterminate"
                    : false
              }
              onCheckedChange={(checked) => {
                handleFamilyToggle();
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="family-content">
              <TruncatedCell text={family.name} maxLength={25} />
            </div>
          </div>
        </TableCell>
        <TableCell className="w-48">
          {family.accessionCount.toLocaleString()}{" "}
          <span className="text-tx-tertiary">
            ({family.species.length} species)
          </span>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <>
          <TableRow className="bg-bg-base border-b-0">
            <TableCell className="text-tx-primary w-full pt-3 pb-2 pl-16 font-mono text-sm font-medium">
              Species
            </TableCell>
            <TableCell className="w-48 pt-3 pb-2"></TableCell>
          </TableRow>
          {filteredSpecies.map((species, index) => (
            <TableRow
              key={species.name}
              className={`bg-bg-base hover:bg-bg-hover cursor-pointer ${index === filteredSpecies.length - 1 ? "" : "border-b-0"}`}
              onClick={() => handleSpeciesToggle(species.name)}
            >
              <TableCell className="text-tx-secondary w-full py-2 pl-16">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filterState.selectedSpecies.has(species.name)}
                    onCheckedChange={() => handleSpeciesToggle(species.name)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <TruncatedCell text={species.name} maxLength={30} />
                </div>
              </TableCell>
              <TableCell className="text-tx-secondary w-48 py-2">
                {species.accessionCount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </>
      )}
    </>
  );
};

export function OverviewFilterCard() {
  const { families, species, statistics, accessions, filterConfig, setFilter } =
    useArboretum();

  // Dialog open state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calculate currently applied filters
  const appliedFilters = useMemo(() => {
    const filters: { family: string; speciesCount: number }[] = [];

    if (filterConfig.type === "FAMILY" && filterConfig.value) {
      const familySpecies = accessions.filter(
        (acc) => acc.family === filterConfig.value
      );
      const uniqueSpecies = new Set(familySpecies.map((acc) => acc.species));
      filters.push({
        family: filterConfig.value,
        speciesCount: uniqueSpecies.size,
      });
    } else if (filterConfig.type === "SPECIES" && filterConfig.value) {
      const speciesAccession = accessions.find(
        (acc) => acc.species === filterConfig.value
      );
      if (speciesAccession) {
        filters.push({ family: speciesAccession.family, speciesCount: 1 });
      }
    } else if (
      filterConfig.type === "MULTIPLE_SPECIES" &&
      filterConfig.values
    ) {
      // Group species by family
      const familyMap = new Map<string, number>();
      filterConfig.values.forEach((speciesName) => {
        const speciesAccession = accessions.find(
          (acc) => acc.species === speciesName
        );
        if (speciesAccession) {
          const currentCount = familyMap.get(speciesAccession.family) || 0;
          familyMap.set(speciesAccession.family, currentCount + 1);
        }
      });
      familyMap.forEach((count, familyName) => {
        filters.push({ family: familyName, speciesCount: count });
      });
    }

    return filters;
  }, [filterConfig, accessions]);

  const clearAllFilters = useCallback(() => {
    setFilter({ type: "ALL", value: "" });
    setIsDialogOpen(false);
  }, [setFilter]);

  return (
    <div className="bg-bg-card flex flex-col rounded border p-2">
      <div className="mb-1 flex px-2">
        <h3 className="text-lg">Data</h3>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="mb-3 flex gap-2 px-2">
          <DialogTrigger asChild>
            <Button variant="tertiary">
              <FilterAlt /> Filters
            </Button>
          </DialogTrigger>
          {appliedFilters.length > 0 && (
            <Button onClick={clearAllFilters}>
              {appliedFilters.reduce(
                (sum, filter) => sum + filter.speciesCount,
                0
              )}{" "}
              species <Xmark />
            </Button>
          )}
          <SelectionDialogContent onClose={() => setIsDialogOpen(false)} />
        </div>
      </Dialog>
      <div className="bg-bg-secondary flex flex-col gap-2 rounded px-4 py-3 font-mono">
        <div className="flex">
          <div className="flex grow flex-col">
            <p className="text-tx-body text-lg">
              {statistics.totalAccessions.toLocaleString()}
            </p>
            <p className="text-tx-tertiary text-sm">Accessions</p>
          </div>
          <div className="flex grow flex-col">
            <p className="text-tx-body text-lg">{statistics.filledCells}</p>
            <p className="text-tx-tertiary text-sm">Filled cells</p>
          </div>
        </div>
        <div className="flex">
          <div className="flex grow flex-col">
            <p className="text-tx-body text-lg">
              {statistics.meanA.toFixed(1)}
            </p>
            <p className="text-tx-tertiary text-sm">Unique Species</p>
          </div>
          <div className="flex grow flex-col">
            <p className="text-tx-body text-lg">
              {statistics.stdDevA.toFixed(2)}
            </p>
            <p className="text-tx-tertiary text-sm">Standard deviation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SelectionDialogContent({ onClose }: { onClose: () => void }) {
  const { accessions, families, species, setFilter, filterConfig } =
    useArboretum();

  // Helper function to compute filter state from config
  const computeFilterState = useCallback((): FilterState => {
    const newState: FilterState = {
      selectedFamilies: new Set(),
      selectedSpecies: new Set(),
    };

    if (filterConfig.type === "FAMILY" && filterConfig.value) {
      newState.selectedFamilies.add(filterConfig.value);
      const familySpecies = accessions
        .filter((acc) => acc.family === filterConfig.value)
        .map((acc) => acc.species);
      familySpecies.forEach((sp) => newState.selectedSpecies.add(sp));
    } else if (filterConfig.type === "SPECIES" && filterConfig.value) {
      newState.selectedSpecies.add(filterConfig.value);
    } else if (
      filterConfig.type === "MULTIPLE_SPECIES" &&
      filterConfig.values
    ) {
      filterConfig.values.forEach((sp) => newState.selectedSpecies.add(sp));
    }

    return newState;
  }, [filterConfig, accessions]);

  // Local filter state for the dialog - initialized from current filters
  const [localFilterState, setLocalFilterState] =
    useState<FilterState>(computeFilterState);

  // Track previous filterConfig to detect changes (adjusting state during render pattern)
  const [prevFilterConfig, setPrevFilterConfig] = useState(filterConfig);
  if (filterConfig !== prevFilterConfig) {
    setPrevFilterConfig(filterConfig);
    setLocalFilterState(computeFilterState());
  }

  // Search state
  const [searchText, setSearchText] = useState("");

  // Sorting state
  const [sortBy, setSortBy] = useState<"family" | "accessions">("accessions");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Expanded accordion state
  const [expandedFamilies, setExpandedFamilies] = useState<Set<string>>(
    new Set()
  );

  // Prepare family data with species and accession counts
  const familyData = useMemo(() => {
    const familyMap = new Map<
      string,
      { species: Map<string, number>; totalAccessions: number }
    >();

    // Filter out the problematic species without family name
    const filteredAccessions = accessions.filter(
      (acc) => acc.species !== "Daphniphyllum longeracemosum"
    );

    filteredAccessions.forEach((acc) => {
      if (!familyMap.has(acc.family)) {
        familyMap.set(acc.family, { species: new Map(), totalAccessions: 0 });
      }

      const family = familyMap.get(acc.family)!;
      family.totalAccessions++;

      if (!family.species.has(acc.species)) {
        family.species.set(acc.species, 0);
      }
      family.species.set(acc.species, family.species.get(acc.species)! + 1);
    });

    const data: FamilyData[] = Array.from(familyMap.entries()).map(
      ([familyName, familyInfo]) => ({
        name: familyName,
        accessionCount: familyInfo.totalAccessions,
        species: Array.from(familyInfo.species.entries())
          .map(([speciesName, count]) => ({
            name: speciesName,
            accessionCount: count,
          }))
          .sort((a, b) => b.accessionCount - a.accessionCount), // Sort species by accession count
      })
    );

    // Sort families
    return data.sort((a, b) => {
      if (sortBy === "family") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc"
          ? a.accessionCount - b.accessionCount
          : b.accessionCount - a.accessionCount;
      }
    });
  }, [accessions, sortBy, sortOrder]);

  // Check if there are changes from the original state
  const hasChanges = useMemo(() => {
    const currentSelected = new Set<string>();

    if (filterConfig.type === "FAMILY" && filterConfig.value) {
      const familySpecies = accessions
        .filter((acc) => acc.family === filterConfig.value)
        .map((acc) => acc.species);
      familySpecies.forEach((sp) => currentSelected.add(sp));
    } else if (filterConfig.type === "SPECIES" && filterConfig.value) {
      currentSelected.add(filterConfig.value);
    } else if (
      filterConfig.type === "MULTIPLE_SPECIES" &&
      filterConfig.values
    ) {
      filterConfig.values.forEach((sp) => currentSelected.add(sp));
    }

    return (
      currentSelected.size !== localFilterState.selectedSpecies.size ||
      !Array.from(currentSelected).every((sp) =>
        localFilterState.selectedSpecies.has(sp)
      )
    );
  }, [filterConfig, accessions, localFilterState.selectedSpecies]);

  // Get selected families based on selected species
  const selectedFamiliesFromSpecies = useMemo(() => {
    const familySet = new Set<string>();
    localFilterState.selectedSpecies.forEach((speciesName) => {
      const accession = accessions.find((acc) => acc.species === speciesName);
      if (accession) {
        familySet.add(accession.family);
      }
    });
    return familySet;
  }, [localFilterState.selectedSpecies, accessions]);

  const handleToggleSort = (column: "family" | "accessions") => {
    if (sortBy === column) {
      // If clicking the active column, toggle between asc/desc
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking an inactive column, switch to that column and start with desc
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleToggleExpanded = (familyName: string) => {
    const newExpanded = new Set(expandedFamilies);
    if (newExpanded.has(familyName)) {
      newExpanded.delete(familyName);
    } else {
      newExpanded.add(familyName);
    }
    setExpandedFamilies(newExpanded);
  };

  const handleApply = () => {
    if (localFilterState.selectedSpecies.size === 0) {
      setFilter({ type: "ALL", value: "" });
    } else if (localFilterState.selectedSpecies.size === 1) {
      const speciesName = Array.from(localFilterState.selectedSpecies)[0];
      setFilter({ type: "SPECIES", value: speciesName });
    } else {
      // For multiple species, check if they all belong to a single family
      const selectedFamilies = Array.from(selectedFamiliesFromSpecies);

      if (selectedFamilies.length === 1) {
        const familyName = selectedFamilies[0];
        const allFamilySpecies = accessions
          .filter((acc) => acc.family === familyName)
          .map((acc) => acc.species);
        const uniqueFamilySpecies = Array.from(new Set(allFamilySpecies));

        // Check if ALL species in the family are selected
        const selectedSpeciesInFamily = uniqueFamilySpecies.filter((sp) =>
          localFilterState.selectedSpecies.has(sp)
        );

        if (selectedSpeciesInFamily.length === uniqueFamilySpecies.length) {
          // All species in family are selected - apply family filter
          setFilter({ type: "FAMILY", value: familyName });
        } else {
          // Partial selection within family - use multiple species filter
          setFilter({
            type: "MULTIPLE_SPECIES",
            value: "",
            values: Array.from(localFilterState.selectedSpecies),
          });
        }
      } else {
        // Multiple families selected - use multiple species filter
        setFilter({
          type: "MULTIPLE_SPECIES",
          value: "",
          values: Array.from(localFilterState.selectedSpecies),
        });
      }
    }

    // Close the dialog
    onClose();
  };

  const handleCancel = () => {
    // Reset local state to current filter state
    const newState: FilterState = {
      selectedFamilies: new Set(),
      selectedSpecies: new Set(),
    };

    if (filterConfig.type === "FAMILY" && filterConfig.value) {
      newState.selectedFamilies.add(filterConfig.value);
      const familySpecies = accessions
        .filter((acc) => acc.family === filterConfig.value)
        .map((acc) => acc.species);
      familySpecies.forEach((sp) => newState.selectedSpecies.add(sp));
    } else if (filterConfig.type === "SPECIES" && filterConfig.value) {
      newState.selectedSpecies.add(filterConfig.value);
    } else if (
      filterConfig.type === "MULTIPLE_SPECIES" &&
      filterConfig.values
    ) {
      filterConfig.values.forEach((sp) => newState.selectedSpecies.add(sp));
    }

    setLocalFilterState(newState);

    // Close the dialog
    onClose();
  };

  const clearFamilyFilter = (familyName: string) => {
    const newSelectedSpecies = new Set(localFilterState.selectedSpecies);
    accessions
      .filter((acc) => acc.family === familyName)
      .forEach((acc) => newSelectedSpecies.delete(acc.species));

    setLocalFilterState({
      ...localFilterState,
      selectedSpecies: newSelectedSpecies,
    });
  };

  return (
    <DialogContent className="bg-bg-card max-w-2xl p-4">
      <DialogHeader className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <DialogTitle className="flex flex-1 text-left text-lg">
            Select filter
          </DialogTitle>
          <div className="flex gap-2">
            <Button variant="tertiary" size="md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="md"
              disabled={
                !hasChanges && localFilterState.selectedSpecies.size === 0
              }
              onClick={handleApply}
            >
              Apply <Check />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {selectedFamiliesFromSpecies.size === 0 ? (
            <>
              <span className="text-tx-secondary text-sm">
                No filters applied,
              </span>
              <span className="text-tx-secondary font-mono text-sm">
                ({species.length} species in dataset)
              </span>
            </>
          ) : (
            <>
              {Array.from(selectedFamiliesFromSpecies).map((familyName) => (
                <Button
                  key={familyName}
                  variant="chipactive"
                  size="sm"
                  onClick={() => clearFamilyFilter(familyName)}
                >
                  <TruncatedCell text={familyName} maxLength={15} /> <Xmark />
                </Button>
              ))}
              <span className="text-tx-secondary font-mono text-sm">
                ({localFilterState.selectedSpecies.size} species selected)
              </span>
            </>
          )}
        </div>

        <div>
          <Input
            placeholder="Search..."
            className="font-mono"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="max-h-96 overflow-x-auto overflow-y-auto">
          <div className="border-bd-primary min-w-full overflow-hidden rounded border">
            <Table className="min-w-full">
              <TableHeader className="bg-bg-primary">
                <TableRow>
                  <TableHead
                    className="hover:bg-bg-hover flex min-w-0 grow cursor-pointer items-center gap-1 text-sm"
                    onClick={() => handleToggleSort("family")}
                  >
                    Family
                    <Button
                      variant="ghost"
                      size="xs"
                      className="flex-shrink-0 px-1"
                    >
                      {sortBy === "family" ? (
                        sortOrder === "asc" ? (
                          <NavArrowDownSolid />
                        ) : (
                          <NavArrowUpSolid />
                        )
                      ) : (
                        <NavArrowDownSolid className="opacity-30" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead
                    className="hover:bg-bg-hover min-w-32 cursor-pointer"
                    onClick={() => handleToggleSort("accessions")}
                  >
                    <div className="flex items-center gap-1">
                      Accessions
                      {sortBy === "accessions" ? (
                        sortOrder === "asc" ? (
                          <NavArrowUpSolid />
                        ) : (
                          <NavArrowDownSolid />
                        )
                      ) : (
                        <NavArrowDownSolid className="opacity-30" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {familyData.map((family) => (
                  <AccordionRow
                    key={family.name}
                    family={family}
                    isExpanded={expandedFamilies.has(family.name)}
                    onToggleExpanded={() => handleToggleExpanded(family.name)}
                    filterState={localFilterState}
                    onFilterChange={setLocalFilterState}
                    searchText={searchText}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  );
}
