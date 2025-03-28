/**
 * Trading Analytics Utility Functions
 * 
 * Містить функції для аналізу торгових даних та генерації рекомендацій
 * на основі різних комбінацій параметрів.
 */

/**
 * Розраховує вінрейт для масиву трейдів
 * @param {Array} trades - масив трейдів для аналізу
 * @returns {Object} об'єкт з показниками: winrate, totalTrades, winTrades, lossTrades
 */
export function calculateWinrate(trades) {
  if (!trades || !Array.isArray(trades) || trades.length === 0) {
    return {
      winrate: 0,
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      breakevenTrades: 0,
      missedTrades: 0,
      totalWinLossTrades: 0
    };
  }

  // Фільтруємо тільки Win і Loss трейди
  const winLossTrades = trades.filter(trade => 
    trade && (trade.result === 'Win' || trade.result === 'Loss')
  );

  const winTrades = winLossTrades.filter(trade => trade.result === 'Win').length;
  const lossTrades = winLossTrades.filter(trade => trade.result === 'Loss').length;
  const totalWinLossTrades = winTrades + lossTrades;
  const breakevenTrades = trades.filter(trade => trade.result === 'Breakeven').length;
  const missedTrades = trades.filter(trade => trade.result === 'Missed').length;

  // Розрахунок вінрейту тільки по Win і Loss трейдам
  const winrate = totalWinLossTrades > 0 
    ? Math.round((winTrades / totalWinLossTrades) * 100) 
    : 0;

  return {
    winrate,
    totalTrades: trades.length,
    winTrades,
    lossTrades,
    breakevenTrades,
    missedTrades,
    totalWinLossTrades
  };
}

/**
 * Аналізує трейди за однією умовою
 * @param {Array} trades - масив трейдів для аналізу
 * @param {String} parameter - параметр для фільтрації
 * @param {String} value - значення параметра
 * @returns {Object} результат аналізу
 */
export function analyzeByParameter(trades, parameter, value) {
  if (!trades || !trades.length) return null;

  const filteredTrades = trades.filter(trade => 
    trade && trade[parameter] && trade[parameter] === value
  );

  const stats = calculateWinrate(filteredTrades);
  
  // Перевіряємо, що є принаймні 5 трейдів з результатом Win або Loss
  if (stats.totalWinLossTrades < 5) return null;
  
  return {
    parameter,
    value,
    ...stats,
    trades: filteredTrades
  };
}

/**
 * Аналізує трейди за комбінацією двох параметрів
 * @param {Array} trades - масив трейдів
 * @param {String} param1 - перший параметр
 * @param {String} value1 - значення першого параметра
 * @param {String} param2 - другий параметр
 * @param {String} value2 - значення другого параметра
 * @returns {Object} результат аналізу
 */
export function analyzeByTwoParameters(trades, param1, value1, param2, value2) {
  if (!trades || !trades.length) return null;

  const filteredTrades = trades.filter(trade => 
    trade && 
    trade[param1] && trade[param1] === value1 &&
    trade[param2] && trade[param2] === value2
  );

  const stats = calculateWinrate(filteredTrades);
  
  // Перевіряємо, що є принаймні 5 трейдів з результатом Win або Loss
  if (stats.totalWinLossTrades < 5) return null;
  
  return {
    combination: `${formatParameterName(param1)}: "${value1}" + ${formatParameterName(param2)}: "${value2}"`,
    parameters: [
      { name: param1, value: value1 },
      { name: param2, value: value2 }
    ],
    ...stats,
    trades: filteredTrades
  };
}

/**
 * Аналізує трейди за комбінацією трьох параметрів
 * @param {Array} trades - масив трейдів
 * @param {String} param1 - перший параметр
 * @param {String} value1 - значення першого параметра
 * @param {String} param2 - другий параметр
 * @param {String} value2 - значення другого параметра
 * @param {String} param3 - третій параметр
 * @param {String} value3 - значення третього параметра
 * @returns {Object} результат аналізу
 */
export function analyzeByThreeParameters(trades, param1, value1, param2, value2, param3, value3) {
  if (!trades || !trades.length) return null;

  const filteredTrades = trades.filter(trade => 
    trade && 
    trade[param1] && trade[param1] === value1 &&
    trade[param2] && trade[param2] === value2 &&
    trade[param3] && trade[param3] === value3
  );

  const stats = calculateWinrate(filteredTrades);
  
  // Перевіряємо, що є принаймні 5 трейдів з результатом Win або Loss
  if (stats.totalWinLossTrades < 5) return null;
  
  return {
    combination: `${formatParameterName(param1)}: "${value1}" + ${formatParameterName(param2)}: "${value2}" + ${formatParameterName(param3)}: "${value3}"`,
    parameters: [
      { name: param1, value: value1 },
      { name: param2, value: value2 },
      { name: param3, value: value3 }
    ],
    ...stats,
    trades: filteredTrades
  };
}

/**
 * Аналізує трейди за комбінацією чотирьох параметрів
 * @param {Array} trades - масив трейдів
 * @param {Array} params - масив об'єктів параметрів [{ name, value }, ...]
 * @returns {Object} результат аналізу
 */
export function analyzeByFourParameters(trades, params) {
  if (!trades || !trades.length || !params || params.length !== 4) return null;

  const filteredTrades = trades.filter(trade => {
    if (!trade) return false;
    
    // Перевіряємо, що трейд відповідає всім параметрам
    return params.every(param => 
      trade[param.name] && trade[param.name] === param.value
    );
  });

  const stats = calculateWinrate(filteredTrades);
  
  // Перевіряємо, що є принаймні 5 трейдів з результатом Win або Loss
  if (stats.totalWinLossTrades < 5) return null;
  
  return {
    combination: params.map(p => `${formatParameterName(p.name)}: "${p.value}"`).join(' + '),
    parameters: params,
    ...stats,
    trades: filteredTrades
  };
}

/**
 * Аналізує трейди за комбінацією багатьох параметрів
 * @param {Array} trades - масив трейдів
 * @param {Array} params - масив об'єктів параметрів [{ name, value }, ...]
 * @returns {Object} результат аналізу
 */
export function analyzeByMultipleParameters(trades, params) {
  if (!trades || !trades.length || !params || params.length < 2) return null;

  const filteredTrades = trades.filter(trade => {
    if (!trade) return false;
    
    // Перевіряємо, що трейд відповідає всім параметрам
    return params.every(param => 
      trade[param.name] && trade[param.name] === param.value
    );
  });

  const stats = calculateWinrate(filteredTrades);
  
  // Перевіряємо, що є принаймні 5 трейдів з результатом Win або Loss
  if (stats.totalWinLossTrades < 5) return null;
  
  return {
    combination: params.map(p => `${formatParameterName(p.name)}: "${p.value}"`).join(' + '),
    parameters: params,
    ...stats,
    trades: filteredTrades
  };
}

/**
 * Formats parameter name to display format
 * @param {String} paramName - Database column name
 * @returns {String} Formatted parameter name
 */
function formatParameterName(paramName) {
  const mappings = {
    'pointA': 'Point A',
    'trigger': 'Trigger',
    'entryModel': 'Entry Model',
    'entryTF': 'Entry Timeframe',
    'pair': 'Pair',
    'session': 'Session',
    'rr': 'RR',
    'slPosition': 'SL Position',
    'volumeConfirmation': 'Volume Confirmation'
  };

  return mappings[paramName] || paramName.charAt(0).toUpperCase() + paramName.slice(1);
}

/**
 * Генерує дескриптивний текст на основі результатів аналізу
 * @param {Object} analysis - результат аналізу
 * @param {Boolean} isHighWinrate - чи є це рекомендація для високого вінрейту
 * @returns {Object} об'єкт з описом і рекомендацією
 */
export function generateDescriptiveText(analysis, isHighWinrate = false) {
  if (!analysis) return { title: '', description: '' };

  const { parameters, winrate, totalTrades, winTrades, lossTrades } = analysis;
  
  // Check if this is a single parameter analysis
  const isSingleParameter = parameters && parameters.length === 1;
  
  // Format the parameters list for the title
  let parametersList = '';
  if (parameters && parameters.length) {
    parametersList = parameters.map(p => `${formatParameterName(p.name)}: "${p.value}"`).join(', ');
  }

  let title = '';
  let description = '';
  
  if (isHighWinrate) {
    // Text for high winrate (Cultivation)
    title = isSingleParameter
      ? `Successful Parameter: ${parametersList} (${winrate}% winrate)`
      : `Successful Combination: ${parametersList} (${winrate}% winrate)`;
    
    if (winrate >= 90) {
      description = isSingleParameter
        ? `This parameter shows excellent results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend focusing on this parameter and increasing position size under these market conditions.`
        : `This parameter combination shows excellent results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend focusing on this strategy and increasing position size under these market conditions.`;
    } else if (winrate >= 75) {
      description = isSingleParameter
        ? `This parameter shows very good results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend actively using this parameter to increase overall profitability.`
        : `This parameter combination shows very good results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend actively using this strategy to increase overall profitability.`;
    } else if (winrate >= 60) {
      description = isSingleParameter
        ? `This parameter has a reliable winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend continuing to use this parameter and looking for opportunities to optimize it.`
        : `This parameter combination has a reliable winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend continuing to use this strategy and looking for opportunities to optimize it.`;
    } else {
      description = isSingleParameter
        ? `This parameter has a stable winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend monitoring this parameter for potential improvement in results.`
        : `This parameter combination has a stable winrate of ${winrate}%. Out of ${totalTrades} trades, ${winTrades} were profitable. We recommend monitoring this strategy for potential improvement in results.`;
    }
  } else {
    // Text for low winrate (Recommendations)
    title = isSingleParameter
      ? `Problematic Parameter: ${parametersList} (${winrate}% winrate)`
      : `Problematic Combination: ${parametersList} (${winrate}% winrate)`;
    
    if (winrate <= 20) {
      description = isSingleParameter
        ? `This parameter has a critically low winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend avoiding this parameter or fundamentally revising your approach to using it.`
        : `This parameter combination has a critically low winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend avoiding this strategy or fundamentally revising your approach to it.`;
    } else if (winrate <= 35) {
      description = isSingleParameter
        ? `This parameter shows unsatisfactory results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend temporarily refraining from using this parameter and analyzing the causes of failure.`
        : `This parameter combination shows unsatisfactory results with a winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend temporarily refraining from using this strategy and analyzing the causes of failure.`;
    } else if (winrate <= 45) {
      description = isSingleParameter
        ? `This parameter has a below-average winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend considering a modification of the approach to this parameter to increase effectiveness.`
        : `This parameter combination has a below-average winrate of ${winrate}%. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend considering a modification of this strategy to increase effectiveness.`;
    } else {
      description = isSingleParameter
        ? `This parameter has a winrate of ${winrate}%, which can be improved. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend revising entry and exit conditions to optimize results when using this parameter.`
        : `This parameter combination has a winrate of ${winrate}%, which can be improved. Out of ${totalTrades} trades, ${lossTrades} were losing trades. We recommend revising entry and exit conditions to optimize results.`;
    }
  }
  
  return {
    title,
    description
  };
}

/**
 * Генерує рекомендації на основі аналізу трейдів
 * @param {Array} trades - масив усіх трейдів
 * @param {Boolean} isHighWinrate - чи генеруємо рекомендації для високого вінрейту
 * @returns {Array} масив рекомендацій
 */
export function generateRecommendations(trades, isHighWinrate = false) {
  if (!trades || !Array.isArray(trades) || trades.length === 0) {
    return [];
  }

  const recommendations = [];
  const winrateThreshold = isHighWinrate ? 60 : 45; // Поріг вінрейту для рекомендацій

  // Отримуємо унікальні значення для кожного параметра
  const uniqueValues = {
    pointA: [...new Set(trades.filter(t => t.pointA).map(t => t.pointA))],
    trigger: [...new Set(trades.filter(t => t.trigger).map(t => t.trigger))],
    entryModel: [...new Set(trades.filter(t => t.entryModel).map(t => t.entryModel))],
    entryTF: [...new Set(trades.filter(t => t.entryTF).map(t => t.entryTF))],
    pair: [...new Set(trades.filter(t => t.pair).map(t => t.pair))],
    session: [...new Set(trades.filter(t => t.session).map(t => t.session))],
    rr: [...new Set(trades.filter(t => t.rr).map(t => t.rr))],
    slPosition: [...new Set(trades.filter(t => t.slPosition).map(t => t.slPosition))],
    volumeConfirmation: [...new Set(trades.filter(t => t.volumeConfirmation).map(t => t.volumeConfirmation))]
  };

  // Аналіз окремих параметрів (особливо важливо для entryModel)
  const singleParameters = [
    'entryModel', 'session', 'pair', 'trigger', 'pointA', 'entryTF'
  ];

  // Аналіз для кожного окремого параметра
  for (const param of singleParameters) {
    for (const value of uniqueValues[param] || []) {
      const analysis = analyzeByParameter(trades, param, value);
      
      if (analysis && analysis.totalWinLossTrades >= 5) {
        if ((isHighWinrate && analysis.winrate >= winrateThreshold) || 
            (!isHighWinrate && analysis.winrate < winrateThreshold)) {
          
          // Створюємо об'єкт, схожий на результат аналізу комбінацій
          const enrichedAnalysis = {
            ...analysis,
            combination: `${formatParameterName(param)}: "${value}"`,
            parameters: [{ name: param, value }]
          };
          
          const { title, description } = generateDescriptiveText(enrichedAnalysis, isHighWinrate);
          
          recommendations.push({
            title,
            description,
            winrate: analysis.winrate,
            totalTrades: analysis.totalTrades,
            winTrades: analysis.winTrades,
            lossTrades: analysis.lossTrades,
            breakevenTrades: analysis.breakevenTrades,
            missedTrades: analysis.missedTrades,
            combination: `${formatParameterName(param)}: "${value}"`,
            parameters: [{ name: param, value }],
            relatedTrades: analysis.trades.map(t => t.id),
            recommendationKey: `${isHighWinrate ? 'high' : 'low'}_single_${param}_${value}`
          });
        }
      }
    }
  }

  // Комбінації з двома параметрами
  const twoCombinations = [
    { param1: 'pointA', param2: 'trigger', description: 'Аналізує взаємозв\'язок між точкою входу і тригером' },
    { param1: 'entryModel', param2: 'entryTF', description: 'Перевіряє, як модель входу працює на різних таймфреймах' },
    { param1: 'pair', param2: 'session', description: 'Досліджує залежність успіху валютної пари від торгової сесії' },
    { param1: 'volumeConfirmation', param2: 'trigger', description: 'Перевіряє, як підтвердження об\'єму впливає на тригер' },
    { param1: 'session', param2: 'slPosition', description: 'Досліджує, як позиція стоп-лосу залежить від сесії' }
  ];

  // Аналіз комбінацій з двома параметрами
  for (const combo of twoCombinations) {
    for (const value1 of uniqueValues[combo.param1] || []) {
      for (const value2 of uniqueValues[combo.param2] || []) {
        const analysis = analyzeByTwoParameters(trades, combo.param1, value1, combo.param2, value2);
        
        if (analysis && analysis.totalWinLossTrades >= 5) {
          // Для низького вінрейту показуємо будь-які рекомендації з вінрейтом нижче порога
          if ((isHighWinrate && analysis.winrate >= winrateThreshold) || 
              (!isHighWinrate && analysis.winrate < winrateThreshold)) {
            
            const { title, description } = generateDescriptiveText(analysis, isHighWinrate);
            
            recommendations.push({
              title,
              description,
              winrate: analysis.winrate,
              totalTrades: analysis.totalTrades,
              winTrades: analysis.winTrades,
              lossTrades: analysis.lossTrades,
              breakevenTrades: analysis.breakevenTrades,
              missedTrades: analysis.missedTrades,
              combination: analysis.combination,
              parameters: analysis.parameters,
              relatedTrades: analysis.trades.map(t => t.id),
              recommendationKey: `${isHighWinrate ? 'high' : 'low'}_${combo.param1}_${value1}_${combo.param2}_${value2}`
            });
          }
        }
      }
    }
  }

  // Комбінації з трьома параметрами
  const threeCombinations = [
    { params: ['pointA', 'trigger', 'pair'], description: 'Аналізує точку входу, тригер і валютну пару разом' },
    { params: ['entryModel', 'entryTF', 'rr'], description: 'Перевіряє модель входу, таймфрейм і співвідношення ризику/винагороди' },
    { params: ['pair', 'session', 'volumeConfirmation'], description: 'Аналізує валютну пару, сесію і підтвердження об\'єму' },
    { params: ['trigger', 'slPosition', 'rr'], description: 'Досліджує взаємозв\'язок тригера, позиції стоп-лосу і RR' }
  ];

  // Аналіз комбінацій з трьома параметрами
  for (const combo of threeCombinations) {
    for (const value1 of uniqueValues[combo.params[0]] || []) {
      for (const value2 of uniqueValues[combo.params[1]] || []) {
        for (const value3 of uniqueValues[combo.params[2]] || []) {
          const analysis = analyzeByThreeParameters(
            trades, 
            combo.params[0], value1, 
            combo.params[1], value2, 
            combo.params[2], value3
          );
          
          if (analysis && analysis.totalWinLossTrades >= 5) {
            // Для низького вінрейту показуємо будь-які рекомендації з вінрейтом нижче порога
            if ((isHighWinrate && analysis.winrate >= winrateThreshold) || 
                (!isHighWinrate && analysis.winrate < winrateThreshold)) {
              
              const { title, description } = generateDescriptiveText(analysis, isHighWinrate);
              
              recommendations.push({
                title,
                description,
                winrate: analysis.winrate,
                totalTrades: analysis.totalTrades,
                winTrades: analysis.winTrades,
                lossTrades: analysis.lossTrades,
                breakevenTrades: analysis.breakevenTrades,
                missedTrades: analysis.missedTrades,
                combination: analysis.combination,
                parameters: analysis.parameters,
                relatedTrades: analysis.trades.map(t => t.id),
                recommendationKey: `${isHighWinrate ? 'high' : 'low'}_${combo.params.join('_')}_${value1}_${value2}_${value3}`
              });
            }
          }
        }
      }
    }
  }

  // Сортуємо рекомендації за вінрейтом (для високого - від найвищого до найнижчого, для низького - навпаки)
  if (isHighWinrate) {
    recommendations.sort((a, b) => b.winrate - a.winrate);
  } else {
    recommendations.sort((a, b) => a.winrate - b.winrate);
  }

  // Обмежуємо кількість рекомендацій для кращої зручності користувача
  return recommendations.slice(0, 20);
}

// Функції для аналізу комбінацій з чотирма та більше параметрами можуть бути додані за потреби 