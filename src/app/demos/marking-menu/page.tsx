"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  const [selectedDirection, setSelectedDirection] = useState<Direction>("N");
  const [directionColors, setDirectionColors] = useState(
    INITIAL_DIRECTION_COLORS
  );

  const handleSelect = (itemId: string) => {
    const direction = itemId as Direction;
    setSelectedDirection(direction);
    setSelectedColor(directionColors[direction].value);
  };

  const assignColorToSlot = useCallback(
    (direction: Direction, colorValue: string) => {
      const color = COLOR_PALETTE.find((c) => c.value === colorValue);
      if (!color) return;

      setDirectionColors((prev) => ({
        ...prev,
        [direction]: color,
      }));
    },
    []
  );

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
                {directionColors[selectedDirection].name}
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
                • <strong>Select Color:</strong> Click and hold on menu, drag to
                select
              </li>
              <li>
                • <strong>Customize Slots:</strong> Drag colors from palette to
                menu positions
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
      </Sidebar>

      <main className="md:col-span-7">
        <StickyCardMask />
        <StickyCard className="rounded border border-bd-primary bg-bg-secondary">
          <div className="flex min-h-[600px] flex-col items-center justify-center gap-12 p-8">
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
                <button className="font-semibold rounded-lg bg-blue-600 px-8 py-4 font-fraktion text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-xl active:scale-95">
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

            {/* Color Palette - Drag and Drop */}
            <ColorPalette onColorAssign={assignColorToSlot} />
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

// Color Palette Component with Drag and Drop
interface ColorPaletteProps {
  onColorAssign: (direction: Direction, colorValue: string) => void;
}

function ColorPalette({ onColorAssign }: ColorPaletteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedColor, setDraggedColor] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredSlot, setHoveredSlot] = useState<Direction | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const dropZonesRef = useRef<Map<Direction, DOMRect>>(new Map());

  // Use first 15 colors for 3x5 grid
  const paletteColors = COLOR_PALETTE.slice(0, 15);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, color: string) => {
      e.stopPropagation(); // Prevent marking menu from capturing
      if (e.button !== 0) return; // Only left click/touch
      if (pointerIdRef.current !== null) return; // Already dragging

      pointerIdRef.current = e.pointerId;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      setIsDragging(true);
      setDraggedColor(color);
      setDragPosition({ x: e.clientX, y: e.clientY });

      // Calculate drop zone positions
      calculateDropZones();
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || draggedColor === null) return;

      setDragPosition({ x: e.clientX, y: e.clientY });

      // Check which drop zone we're hovering over
      const hoveredDirection = getHoveredDropZone(e.clientX, e.clientY);
      setHoveredSlot(hoveredDirection);
    },
    [isDragging, draggedColor]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (pointerIdRef.current === null) return;

      (e.target as HTMLElement).releasePointerCapture(pointerIdRef.current);
      pointerIdRef.current = null;

      // If we're over a drop zone, assign the color
      if (hoveredSlot && draggedColor) {
        onColorAssign(hoveredSlot, draggedColor);
      }

      // Reset drag state
      setIsDragging(false);
      setDraggedColor(null);
      setHoveredSlot(null);
    },
    [hoveredSlot, draggedColor, onColorAssign]
  );

  const calculateDropZones = () => {
    // This will be populated by the DropTargetOverlay component
    // For now, we'll leave it as a placeholder
  };

  const getHoveredDropZone = (x: number, y: number): Direction | null => {
    for (const [direction, rect] of dropZonesRef.current.entries()) {
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        return direction;
      }
    }
    return null;
  };

  return (
    <>
      <div className="w-full max-w-2xl">
        <div className="mb-4 text-center">
          <h3 className="font-semibold mb-1 text-lg">Color Palette</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Press and drag a color to a menu slot
          </p>
        </div>

        {/* 3x5 Color Grid */}
        <div className="grid grid-cols-5 gap-3 rounded-lg border border-bd-primary bg-bg-primary p-4">
          {paletteColors.map((color, index) => (
            <div
              key={index}
              onPointerDown={(e) => handlePointerDown(e, color.value)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="aspect-square cursor-grab rounded-lg shadow-md transition-all hover:scale-110 active:scale-95 active:cursor-grabbing"
              style={{
                backgroundColor: color.value,
                opacity: draggedColor === color.value ? 0.5 : 1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Drag Preview */}
      {isDragging && draggedColor && (
        <div
          className="pointer-events-none fixed z-50 h-12 w-12 rounded-lg shadow-2xl"
          style={{
            backgroundColor: draggedColor,
            left: dragPosition.x - 24,
            top: dragPosition.y - 24,
            opacity: 0.8,
          }}
        />
      )}

      {/* Drop Target Overlay */}
      {isDragging && (
        <DropTargetOverlay
          hoveredSlot={hoveredSlot}
          onDropZonesCalculated={(zones) => {
            dropZonesRef.current = zones;
          }}
        />
      )}
    </>
  );
}

// Drop Target Overlay Component
interface DropTargetOverlayProps {
  hoveredSlot: Direction | null;
  onDropZonesCalculated: (zones: Map<Direction, DOMRect>) => void;
}

function DropTargetOverlay({
  hoveredSlot,
  onDropZonesCalculated,
}: DropTargetOverlayProps) {
  const dropZoneRefs = useRef<Map<Direction, HTMLDivElement | null>>(new Map());

  // Calculate drop zone positions after mount
  useEffect(() => {
    const zones = new Map<Direction, DOMRect>();
    dropZoneRefs.current.forEach((element, direction) => {
      if (element) {
        zones.set(direction, element.getBoundingClientRect());
      }
    });
    onDropZonesCalculated(zones);
  }, [onDropZonesCalculated]);

  // Direction positions in a radial layout
  const directions: Direction[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  // Calculate angle for each direction
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

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="relative h-96 w-96">
        {directions.map((direction) => {
          const angle = angles[direction];
          const radius = 140;
          const angleRad = (angle * Math.PI) / 180;
          const x = Math.cos(angleRad) * radius;
          const y = Math.sin(angleRad) * radius;
          const isHovered = hoveredSlot === direction;

          return (
            <div
              key={direction}
              ref={(el) => {
                dropZoneRefs.current.set(direction, el);
              }}
              className="pointer-events-auto absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-lg border-4 bg-white/90 transition-all dark:bg-gray-800/90"
                style={{
                  borderColor: isHovered ? "#22C55E" : "#9CA3AF",
                  transform: isHovered ? "scale(1.2)" : "scale(1)",
                  boxShadow: isHovered
                    ? "0 0 20px rgba(34, 197, 94, 0.6)"
                    : "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="text-center">
                  <div className="font-bold text-xs text-gray-700 dark:text-gray-200">
                    {direction}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
