import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const defaultColors = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
];

const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');

  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-2">Colors</label>

      <Controller
        name="colors"
        control={control}
        render={({ field }) => (
          <div className="flex gap-3 flex-wrap">
            {[...defaultColors, ...customColors].map((color) => {
              const selected = (field.value || []).includes(color);
              const isLight = ['#ffffff', '#ffff00'].includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    if (selected) {
                      field.onChange(
                        field.value.filter((c: string) => c !== color),
                      );
                    } else {
                      field.onChange([...(field.value || []), color]);
                    }
                  }}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${selected ? 'border-primary scale-110' : 'border-gray-600'}
                  `}
                  style={{ backgroundColor: color }}
                >
                  {selected && (
                    <span
                      className={`text-xs font-bold ${
                        isLight ? 'text-black' : 'text-white'
                      }`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}

            {/* Add custom color */}
            <button
              type="button"
              onClick={() => setShowColorPicker(true)}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
      />

      {/* Custom color picker */}
      {showColorPicker && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 p-0 border-none"
          />
          <button
            type="button"
            disabled={customColors.includes(newColor)}
            className="
    px-4 py-1.5
    rounded-md
    bg-blue-600
    text-white text-sm font-medium
    shadow-sm
    transition-all duration-200
    hover:bg-primary/90
    hover:shadow-md
    focus:outline-none
    focus:ring-2 focus:ring-primary/50
    disabled:bg-gray-400
    disabled:cursor-not-allowed
    disabled:shadow-none
  "
            onClick={() => {
              if (!customColors.includes(newColor)) {
                setCustomColors((prev) => [...prev, newColor]);
              }
              setShowColorPicker(false);
            }}
          >
            Add Color
          </button>
        </div>
      )}

      {errors?.colors && (
        <p className="text-red-500 text-xs mt-1">{errors.colors.message}</p>
      )}
    </div>
  );
};

export default ColorSelector;
