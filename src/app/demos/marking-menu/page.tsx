"use client";

import { useState } from "react";
import { Sidebar, SidebarNav } from "@/components/Sidebar";
import { StickyCard, StickyCardMask } from "@/components/StickyCard";
import {
  MarkingMenu,
  MarkingMenuTrigger,
  MarkingMenuContent,
  MarkingMenuItem,
  KeyboardIndicator,
  type Direction,
} from "@react-marking-menu/core";

// Available color palette
const COLOR_PALETTE = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Gray", value: "#6B7280" },
];

// Initial color mapping for each direction
const INITIAL_DIRECTION_COLORS: Record<
  Direction,
  { name: string; value: string }
> = {
  N: { name: "Red", value: "#EF4444" },
  NE: { name: "Orange", value: "#F97316" },
  E: { name: "Yellow", value: "#EAB308" },
  SE: { name: "Lime", value: "#84CC16" },
  S: { name: "Cyan", value: "#06B6D4" },
  SW: { name: "Blue", value: "#3B82F6" },
  W: { name: "Purple", value: "#A855F7" },
  NW: { name: "Pink", value: "#EC4899" },
};

export default function MarkingMenuPage() {
  const [selectedColor, setSelectedColor] = useState(
    INITIAL_DIRECTION_COLORS.N.value
  );
  const [selectedColorName, setSelectedColorName] = useState(
    INITIAL_DIRECTION_COLORS.N.name
  );
  const [selectedDirection, setSelectedDirection] = useState<Direction>("N");
  const [directionColors, setDirectionColors] = useState(
    INITIAL_DIRECTION_COLORS
  );

  const handleSelect = (itemId: string) => {
    const direction = itemId as Direction;
    setSelectedDirection(direction);
    setSelectedColor(directionColors[direction].value);
    setSelectedColorName(directionColors[direction].name);
  };

  const assignColorToSlot = (direction: Direction, colorValue: string) => {
    const color = COLOR_PALETTE.find((c) => c.value === colorValue);
    if (!color) return;

    setDirectionColors((prev) => ({
      ...prev,
      [direction]: color,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <Sidebar className="md:col-span-5 md:w-auto">
        <SidebarNav
          href={"/?tab=demos"}
          breadcrumb={"demos"}
          page={"marking-menu"}
          className="top-6 shadow-xs"
        />

        {/* Controls Section */}
        <div className="border-bd-primary bg-bg-secondary rounded border p-6">
          <h3 className="mb-6 text-lg font-semibold">Selected Color</h3>

          {/* SVG that changes color */}
          <div className="flex flex-col items-center gap-4">
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              className="transition-all duration-300"
            >
              <circle
                cx="100"
                cy="100"
                r="80"
                fill={selectedColor}
                className="drop-shadow-lg"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.2"
              />
            </svg>

            <div className="text-center">
              <div className="mb-1 text-2xl font-bold">{selectedColorName}</div>
              <div className="text-tx-secondary font-mono text-sm">
                {selectedDirection} • {selectedColor}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-bg-primary mt-8 rounded p-4 text-sm">
            <p className="mb-2 font-semibold">How to use:</p>
            <ul className="text-tx-body space-y-1">
              <li>
                • <strong>Select Color:</strong> Click and hold on menu, drag to
                select
              </li>
              <li>
                • <strong>Customize Slots:</strong> Click and hold on any color
                chip to assign it
              </li>
              <li>
                • <strong>Keyboard:</strong> Press arrow keys to navigate menu
              </li>
              <li>
                • <strong>Diagonals:</strong> Hold two arrow keys
              </li>
              <li>
                • <strong>Cancel:</strong> Press Escape
              </li>
            </ul>
          </div>
        </div>

        {/* Package Info Card - Visible on md and up */}
        <div className="border-bd-primary bg-bg-secondary hidden rounded border p-6 md:block">
          <h3 className="mb-4 text-lg font-semibold">React Marking Menu</h3>
          <p className="text-tx-secondary mb-6 text-sm">
            A React library for creating radial context menus with pointer and
            keyboard support.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.npmjs.com/package/@react-marking-menu/core"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.334v8h6.666v1.332H5.334V18H12v-1.334H9.334v-1.332h12.666V7.334H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
              </svg>
              View on npm
            </a>
            <a
              href="https://github.com/pageofswrds/react-marking-menu"
              target="_blank"
              rel="noopener noreferrer"
              className="border-bd-primary bg-bg-primary text-tx-primary hover:bg-bg-hover flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-all hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </Sidebar>

      <main className="pb-12 md:col-span-7">
        <StickyCardMask />
        <StickyCard className="border-bd-primary bg-bg-secondary rounded border">
          <div className="flex min-h-[600px] flex-col items-center justify-center gap-12 p-8 pb-12 md:gap-32 md:pt-48">
            <MarkingMenu
              onSelect={handleSelect}
              config={{
                originMode: "element", // Center menu around the button
              }}
              a11y={{
                label: "Color picker menu",
                description: "Select a color using pointer or arrow keys",
              }}
            >
              {/* Trigger Button */}
              <MarkingMenuTrigger asChild>
                <button className="marking-menu-trigger font-fraktion rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95">
                  Open Color Menu
                </button>
              </MarkingMenuTrigger>

              {/* Menu Content */}
              <MarkingMenuContent>
                {(Object.keys(directionColors) as Direction[]).map(
                  (direction) => {
                    const color = directionColors[direction];
                    return (
                      <MarkingMenuItem
                        key={direction}
                        id={direction}
                        direction={direction}
                        label={color.name}
                      >
                        {({ isHighlighted, state }) => (
                          <ColorSlice
                            direction={direction}
                            color={color.value}
                            label={color.name}
                            isHighlighted={isHighlighted}
                            isVisible={
                              state === "active" || state === "selecting"
                            }
                          />
                        )}
                      </MarkingMenuItem>
                    );
                  }
                )}
              </MarkingMenuContent>

              {/* Keyboard Indicator */}
              <KeyboardIndicator
                style={{
                  position: "fixed",
                  bottom: "2rem",
                  right: "2rem",
                  zIndex: 1000,
                }}
              />
            </MarkingMenu>

            {/* Color Palette - Marking Menus */}
            <ColorPalette
              onColorAssign={assignColorToSlot}
              directionColors={directionColors}
            />
          </div>
        </StickyCard>

        {/* Package Info Card - Visible on sm and below */}
        <div className="border-bd-primary bg-bg-secondary mt-8 w-full rounded-lg border p-6 md:hidden">
          <h3 className="mb-4 text-lg font-semibold">React Marking Menu</h3>
          <p className="text-tx-secondary mb-6 text-sm">
            A React library for creating radial context menus with pointer and
            keyboard support.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.npmjs.com/package/@react-marking-menu/core"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 7.334v8h6.666v1.332H5.334V18H12v-1.334H9.334v-1.332h12.666V7.334H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
              </svg>
              View on npm
            </a>
            <a
              href="https://github.com/pageofswrds/react-marking-menu"
              target="_blank"
              rel="noopener noreferrer"
              className="border-bd-primary bg-bg-primary text-tx-primary hover:bg-bg-hover flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-all hover:shadow-md"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Circular Color Target Component
interface ColorSliceProps {
  direction: Direction;
  color: string;
  label: string;
  isHighlighted: boolean;
  isVisible: boolean;
}

function ColorSlice({
  direction,
  color,
  label,
  isHighlighted,
  isVisible,
}: ColorSliceProps) {
  // Calculate angle for this direction (matching the library's coordinate system)
  const angles: Record<Direction, number> = {
    E: 0,
    SE: 45,
    S: 90,
    SW: 135,
    W: 180,
    NW: 225,
    N: 270,
    NE: 315,
  };

  const angle = angles[direction];
  const radius = 140; // Distance from center to color target
  const targetSize = 60; // Size of each color circle

  // Calculate position using the angle directly
  // No rotation needed - angles are already in screen coordinates
  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        pointerEvents: "none",
        transition: "all 0.2s ease-out",
      }}
    >
      <div
        className="flex flex-col items-center gap-2"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isHighlighted ? 1.2 : 1})`,
          transition: "all 0.2s ease-out",
        }}
      >
        {/* Color Circle */}
        <div
          style={{
            width: targetSize,
            height: targetSize,
            borderRadius: "50%",
            backgroundColor: color,
            border: isHighlighted ? "4px solid white" : "2px solid white",
            boxShadow: isHighlighted
              ? `0 0 20px ${color}, 0 4px 12px rgba(0,0,0,0.3)`
              : "0 2px 8px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-out",
          }}
        />

        {/* Label */}
        <div
          className="rounded px-2 py-1 text-sm font-semibold"
          style={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            opacity: isHighlighted ? 1 : 0.8,
            transform: `scale(${isHighlighted ? 1.1 : 1})`,
            transition: "all 0.2s ease-out",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// Color Chip with Marking Menu
interface ColorChipMenuProps {
  color: { name: string; value: string };
  onColorAssign: (direction: Direction, colorValue: string) => void;
  directionColors: Record<Direction, { name: string; value: string }>;
}

function ColorChipMenu({
  color,
  onColorAssign,
  directionColors,
}: ColorChipMenuProps) {
  return (
    <MarkingMenu
      onSelect={(itemId) => {
        const direction = itemId as Direction;
        onColorAssign(direction, color.value);
      }}
      config={{
        originMode: "element",
      }}
      a11y={{
        label: `Assign ${color.name} to menu slot`,
        description: "Select a direction to assign this color",
      }}
    >
      <MarkingMenuTrigger asChild>
        <button
          className="marking-menu-trigger aspect-square rounded-lg shadow-md transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: color.value,
          }}
          aria-label={`Assign ${color.name}`}
        />
      </MarkingMenuTrigger>

      <MarkingMenuContent>
        {(["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as Direction[]).map(
          (direction) => {
            const currentSlotColor = directionColors[direction];
            const isCurrentlyAssigned = currentSlotColor.value === color.value;

            return (
              <MarkingMenuItem
                key={direction}
                id={direction}
                direction={direction}
                label={`${direction} - ${currentSlotColor.name}`}
              >
                {({ isHighlighted, state }) => (
                  <DirectionIndicator
                    direction={direction}
                    color={currentSlotColor.value}
                    colorName={currentSlotColor.name}
                    isHighlighted={isHighlighted}
                    isVisible={state === "active" || state === "selecting"}
                    isAssigned={isCurrentlyAssigned}
                  />
                )}
              </MarkingMenuItem>
            );
          }
        )}
      </MarkingMenuContent>
    </MarkingMenu>
  );
}

// Color Palette Component with Marking Menus
interface ColorPaletteProps {
  onColorAssign: (direction: Direction, colorValue: string) => void;
  directionColors: Record<Direction, { name: string; value: string }>;
}

function ColorPalette({ onColorAssign, directionColors }: ColorPaletteProps) {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 text-center">
        <h3 className="mb-1 text-lg font-semibold">Color Palette</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click and hold on a color to assign it to a menu slot
        </p>
      </div>

      {/* 3x4 Color Grid with Marking Menus */}
      <div className="border-bd-primary bg-bg-primary grid grid-cols-4 gap-3 rounded-lg border p-4">
        {COLOR_PALETTE.map((color) => (
          <ColorChipMenu
            key={color.value}
            color={color}
            onColorAssign={onColorAssign}
            directionColors={directionColors}
          />
        ))}
      </div>
    </div>
  );
}

// Direction Indicator Component for Color Chip Menus
interface DirectionIndicatorProps {
  direction: Direction;
  color: string;
  colorName: string;
  isHighlighted: boolean;
  isVisible: boolean;
  isAssigned: boolean;
}

function DirectionIndicator({
  direction,
  color,
  colorName,
  isHighlighted,
  isVisible,
  isAssigned,
}: DirectionIndicatorProps) {
  // Calculate angle for this direction
  const angles: Record<Direction, number> = {
    E: 0,
    SE: 45,
    S: 90,
    SW: 135,
    W: 180,
    NW: 225,
    N: 270,
    NE: 315,
  };

  const angle = angles[direction];
  const radius = 100; // Smaller radius for chip menus
  const indicatorSize = 40; // Smaller indicators

  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        pointerEvents: "none",
        transition: "all 0.2s ease-out",
      }}
    >
      <div
        className="flex flex-col items-center gap-1"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isHighlighted ? 1.3 : 1})`,
          transition: "all 0.2s ease-out",
        }}
      >
        {/* Direction Circle */}
        <div
          style={{
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: "50%",
            backgroundColor: color,
            border: isHighlighted ? "3px solid white" : "2px solid white",
            boxShadow: isHighlighted
              ? `0 0 15px ${color}, 0 3px 10px rgba(0,0,0,0.3)`
              : "0 2px 6px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-out",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Checkmark for currently assigned directions */}
          {isAssigned && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))",
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {/* Direction Label */}
        <div
          className="rounded px-1.5 py-0.5 text-xs font-semibold"
          style={{
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            opacity: isHighlighted ? 1 : 0.8,
            transform: `scale(${isHighlighted ? 1.1 : 1})`,
            transition: "all 0.2s ease-out",
          }}
        >
          {direction}
        </div>
      </div>
    </div>
  );
}
