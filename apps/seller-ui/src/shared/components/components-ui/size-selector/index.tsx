import { Controller } from 'react-hook-form';

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface SizeSelectorProps {
  control: any;
  errors?: any;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ control, errors }) => {
  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-2">
        Available Sizes *
      </label>

      <Controller
        name="sizes"
        control={control}
        rules={{
          required: 'At least one size must be selected',
        }}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {defaultSizes.map((size) => {
              const selected = (field.value || []).includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      field.onChange(
                        field.value.filter((s: string) => s !== size),
                      );
                    } else {
                      field.onChange([...(field.value || []), size]);
                    }
                  }}
                  className={`
                    px-3 py-1.5
                    rounded-md
                    text-sm font-medium
                    border
                    transition-all
                    ${
                      selected
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      />

      {errors?.sizes && (
        <p className="text-red-500 text-xs mt-1">
          {errors.sizes.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
