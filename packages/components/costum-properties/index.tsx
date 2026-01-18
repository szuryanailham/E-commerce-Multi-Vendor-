import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { X } from 'lucide-react';

type Property = {
  label: string;
  values: string[];
};

const CostumProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newValues, setNewValues] = useState<Record<number, string>>({});

  return (
    <div>
      <Controller
        name="custom_properties"
        control={control}
        render={({ field }) => {
          // sync local state → react-hook-form
          useEffect(() => {
            field.onChange(properties);
          }, [properties]);

          const addProperty = () => {
            if (!newLabel.trim()) return;
            setProperties((prev) => [...prev, { label: newLabel, values: [] }]);
            setNewLabel('');
          };

          const addValue = (index: number) => {
            const value = newValues[index];
            if (!value?.trim()) return;

            setProperties((prev) =>
              prev.map((prop, i) =>
                i === index
                  ? { ...prop, values: [...prop.values, value] }
                  : prop,
              ),
            );

            setNewValues((prev) => ({ ...prev, [index]: '' }));
          };

          const removeProperty = (index: number) => {
            setProperties((prev) => prev.filter((_, i) => i !== index));
          };

          return (
            <div className="mt-2">
              <label className="block font-semibold text-gray-300 mb-2">
                Custom Properties
              </label>

              {/* Add Property */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Property name (e.g. Color, Size)"
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white"
                />
                <button
                  type="button"
                  onClick={addProperty}
                  className="px-4 py-2 bg-primary bg-blue-600 text-white rounded-md text-sm"
                >
                  Add
                </button>
              </div>

              {/* Properties */}
              <div className="flex flex-col gap-3">
                {properties.map((property, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 p-3 rounded-lg bg-gray-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {property.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeProperty(index)}
                      >
                        <X size={18} className="text-red-500" />
                      </button>
                    </div>

                    {/* Add value */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newValues[index] || ''}
                        onChange={(e) =>
                          setNewValues((prev) => ({
                            ...prev,
                            [index]: e.target.value,
                          }))
                        }
                        placeholder="Enter value..."
                        className="border border-gray-700 bg-gray-800 p-2 rounded-md text-white w-full"
                      />
                      <button
                        type="button"
                        className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
                        onClick={() => addValue(index)}
                      >
                        Add
                      </button>
                    </div>

                    {/* Values */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.values.map((value, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-700 text-white rounded-md text-sm"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />

      {errors?.custom_properties && (
        <p className="text-red-500 text-xs mt-1">
          Please fill all properties correctly
        </p>
      )}
    </div>
  );
};

export default CostumProperties;
