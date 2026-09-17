export async function fetchQuizQuestions() {
    const token = import.meta.env.VITE_API_BEARER_TOKEN;
  const response = await fetch('/api-countries/countries/v5?limit=12', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to Fetch quiz data');
  }

  const result = await response.json();

  // 1. Filter valid countries with correct capital object structure & names.common
  const validCountries = result.data.objects.filter((country) => {
    // Flag URL check
    const hasFlag = Boolean(country.flag?.url_svg || country.flag?.url_png);

    // Capital check: capitals is an array of objects containing names or direct values
    const capitalObj = country.capitals?.[0];
    const capitalName = typeof capitalObj === 'string' 
      ? capitalObj 
      : (capitalObj?.name || capitalObj?.common);

    const hasCapital = Boolean(capitalName && String(capitalName).trim().length > 0);
    const hasName = Boolean(country.names?.common);

    return hasFlag && hasCapital && hasName;
  });

  // 2. Pick 10 target countries
  const targetCountries = [...validCountries]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  // 3. Map questions using country.names.common
  const questions = targetCountries.map((country) => {
    const correctAnswer = country.names?.common;

    // Capital name extraction
    const capitalObj = country.capitals?.[0];
    const capitalName = typeof capitalObj === 'string' 
      ? capitalObj 
      : (capitalObj?.name || capitalObj?.common || "Capital");

    // Grab 3 random wrong answers using names.common
    const wrongAnswers = validCountries
      .filter((c) => c.names?.common !== correctAnswer)
      .map((c) => c.names?.common)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Combine and shuffle options
    const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

    return {
      ...country,
      correctAnswer: correctAnswer,
      capitalName: capitalName,
      options: options,
    };
  });

  return questions;
}