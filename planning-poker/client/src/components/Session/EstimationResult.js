// src/components/Session/EstimationResult.js
import React, { useMemo } from 'react';

const EstimationResult = ({ estimations, isRevealed, sessionStatus }) => {
  // Calculate stats if revealed
  const stats = useMemo(() => {
    if (!isRevealed || !estimations.length) return null;
    
    // Get all numerical values
    const numericValues = estimations
      .filter(est => est.card && !est.card.isSpecial)
      .map(est => {
        const value = est.card.value;
        return isNaN(parseFloat(value)) ? null : parseFloat(value);
      })
      .filter(val => val !== null);
    
    if (!numericValues.length) return { count: estimations.length };
    
    return {
      count: estimations.length,
      avg: (numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length).toFixed(1),
      min: Math.min(...numericValues),
      max: Math.max(...numericValues)
    };
  }, [estimations, isRevealed]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Estimations</h2>
      
      {estimations.length === 0 ? (
        <p className="text-gray-500 text-center py-2">No estimations yet</p>
      ) : (
        <>
          {isRevealed && stats && (
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total votes:</div>
                <div className="font-medium">{stats.count}</div>
                
                {stats.avg && (
                  <>
                    <div>Average:</div>
                    <div className="font-medium">{stats.avg}</div>
                  </>
                )}
                
                {stats.min !== undefined && (
                  <>
                    <div>Min:</div>
                    <div className="font-medium">{stats.min}</div>
                  </>
                )}
                
                {stats.max !== undefined && (
                  <>
                    <div>Max:</div>
                    <div className="font-medium">{stats.max}</div>
                  </>
                )}
              </div>
            </div>
          )}
          
          <ul className="divide-y divide-gray-200">
            {estimations.map((est, index) => (
              <li key={index} className="py-3 flex items-center">
                <span className="flex-grow">
                  {est.user.displayName || est.user.username || `User ${index + 1}`}
                </span>
                {isRevealed ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                    {est.card ? est.card.displayValue : '?'}
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                    Voted
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EstimationResult;