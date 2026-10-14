const mockTrucksTemplate = Array.from({ length: 10000 }).map((_, i) => ({
  name: `Truck ${i}`,
  weekday: new Date(Date.now() + Math.random() * 10000000000).toISOString()
}));

function beforeOptimization(fetchedTrucks, showNextWeek = false) {
  return fetchedTrucks.reduce((acc, truck) => {
    const truckDate = new Date(truck.weekday);
    const formattedDate = truckDate.toLocaleDateString('en-US');
    truck.weekday = formattedDate;

    const currentDate = new Date();
    const firstDayOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay() + (showNextWeek ? 7 : 0)
    );

    const weekLabel = truckDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (truckDate >= firstDayOfWeek && truckDate < new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 7)) {
      if (!acc[weekLabel]) {
        acc[weekLabel] = [];
      }
      acc[weekLabel].push(truck);
    }

    return acc;
  }, {});
}

function afterOptimization(fetchedTrucks, showNextWeek = false) {
  const currentDate = new Date();
  const firstDayOfWeek = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay() + (showNextWeek ? 7 : 0)
  );
  const lastDayOfWeek = new Date(
    firstDayOfWeek.getFullYear(),
    firstDayOfWeek.getMonth(),
    firstDayOfWeek.getDate() + 7
  );

  return fetchedTrucks.reduce((acc, truck) => {
    const truckDate = new Date(truck.weekday);
    const formattedDate = truckDate.toLocaleDateString('en-US');
    truck.weekday = formattedDate;

    const weekLabel = truckDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (truckDate >= firstDayOfWeek && truckDate < lastDayOfWeek) {
      if (!acc[weekLabel]) {
        acc[weekLabel] = [];
      }
      acc[weekLabel].push(truck);
    }

    return acc;
  }, {});
}

let totalBefore = 0;
let totalAfter = 0;
const iterations = 10;

for (let i = 0; i < iterations; i++) {
  // deep clone each iteration to not mess up the data since it is mutated inside
  const mockTrucks1 = JSON.parse(JSON.stringify(mockTrucksTemplate));
  const mockTrucks2 = JSON.parse(JSON.stringify(mockTrucksTemplate));

  // GC hint if node --expose-gc is used
  if (typeof global.gc === 'function') global.gc();

  const start1 = performance.now();
  beforeOptimization(mockTrucks1);
  const end1 = performance.now();
  totalBefore += (end1 - start1);

  if (typeof global.gc === 'function') global.gc();

  const start2 = performance.now();
  afterOptimization(mockTrucks2);
  const end2 = performance.now();
  totalAfter += (end2 - start2);
}

const avgBefore = totalBefore / iterations;
const avgAfter = totalAfter / iterations;

console.log(`Average Baseline execution time (10k items): ${avgBefore.toFixed(2)}ms`);
console.log(`Average Optimized execution time (10k items): ${avgAfter.toFixed(2)}ms`);
console.log(`Improvement: ${((avgBefore - avgAfter) / avgBefore * 100).toFixed(2)}%`);