interface FeatureProps {
  title: string;
  description: string;
  isBeta?: boolean;
}

export function Feature({ title, description, isBeta = false }: FeatureProps) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold">{title}</h3>
        {isBeta && (
          <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full animate-pulse">
            BETA
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}