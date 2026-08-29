const getStrengthTextClass = (score) => {
  if (score === 0) return "text-red-600";
  if (score === 1) return "text-orange-500";
  if (score === 2) return "text-yellow-500";
  if (score === 3) return "text-blue-600";
  return "text-green-600";
};

const getStrengthBarClass = (score) => {
  if (score === 0) return "w-1/5 bg-red-600";
  if (score === 1) return "w-2/5 bg-orange-500";
  if (score === 2) return "w-3/5 bg-yellow-500";
  if (score === 3) return "w-4/5 bg-blue-600";
  return "w-full bg-green-600";
};

const getStrengthLabel = (score) => {
  const labels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong",
  ];

  return labels[score];
};

const PasswordStrengthMeter = ({ strength }) => {
  if (!strength) {
    return null;
  }

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1">
        <span>Password Strength</span>

        <span className={getStrengthTextClass(strength.score)}>
          {getStrengthLabel(strength.score)}
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthBarClass(
            strength.score
          )}`}
        />
      </div>

      {strength.feedback?.warning && (
        <p className="text-red-500 text-xs mt-2">
          {strength.feedback.warning}
        </p>
      )}

      {strength.feedback?.suggestions?.length > 0 && (
        <ul className="mt-2 text-xs text-gray-600 list-disc list-inside space-y-1">
          {strength.feedback.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;