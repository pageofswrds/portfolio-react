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

// Color mapping for each direction
const DIRECTION_COLORS: Record<Direction, { name: string; value: string }> = {
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
  const [selectedColor, setSelectedColor] = useState(DIRECTION_COLORS.N.value);
  const [selectedDirection, setSelectedDirection] = useState<Direction>("N");

  const handleSelect = (itemId: string) => {
    const direction = itemId as Direction;
    setSelectedDirection(direction);
    setSelectedColor(DIRECTION_COLORS[direction].value);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
      <Sidebar className="md:col-span-5 md:w-auto">
        <SidebarNav
          href={"/?tab=demos"}
          breadcrumb={"demos"}
          page={"marking-menu"}
          className="top-6 shadow-sm"
        />

        {/* Controls Section */}
        <div className="rounded border border-bd-primary bg-bg-secondary p-6">
          <h3 className="font-semibold mb-6 text-lg">Selected Color</h3>

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
              <div className="text-2xl font-bold mb-1">
                {DIRECTION_COLORS[selectedDirection].name}
              </div>
              <div className="font-mono text-sm text-gray-500">
                {selectedDirection} • {selectedColor}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded bg-gray-50 p-4 text-sm dark:bg-gray-800">
            <p className="font-semibold mb-2">How to use:</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>
                • <strong>Mouse:</strong> Click and hold, drag to select
              </li>
              <li>
                • <strong>Keyboard:</strong> Press arrow keys
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
      </Sidebar>

      <main className="md:col-span-7">
        <StickyCardMask />
        <StickyCard className="rounded border border-bd-primary bg-bg-secondary">
          <div className="flex min-h-[600px] items-center justify-center p-8">
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
                <button className="font-semibold rounded-lg bg-blue-600 px-8 py-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95">
                  Open Color Menu
                </button>
              </MarkingMenuTrigger>

              {/* Menu Content */}
              <MarkingMenuContent>
                {(Object.keys(DIRECTION_COLORS) as Direction[]).map(
                  (direction) => {
                    const color = DIRECTION_COLORS[direction];
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
          </div>
        </StickyCard>
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

  // Calculate position (angle is already in correct coordinate system)
  const angleRad = ((angle - 90) * Math.PI) / 180;
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
          className="font-semibold rounded px-2 py-1 text-sm"
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
