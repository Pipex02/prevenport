export type TelemetrySeries = {
  labels: Date[];
  rpm: number[];
  speed: number[];
  temperature: number[];
  consumption: number[];
};

const createRandom = (seed: number) => {
  let value = (seed % 2147483647) + 2147483647;
  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
};

export const generateTelemetry = (seed: number, hours: number): TelemetrySeries => {
  const random = createRandom(seed * 1000 + hours);
  const totalPoints = Math.max(1, hours * 12);
  const labels: Date[] = [];
  const rpm: number[] = [];
  const speed: number[] = [];
  const temperature: number[] = [];
  const consumption: number[] = [];
  const now = Date.now();

  for (let index = totalPoints - 1; index >= 0; index -= 1) {
    const timestamp = new Date(now - index * 5 * 60 * 1000);
    const base = 0.6 + random() * 0.4;
    const rpmValue = Math.round(1400 + base * 600 + random() * 80);
    const speedValue = Math.max(0, Math.round((base - 0.4) * 60 + random() * 5));
    const temperatureValue = Math.round(65 + base * 10 + random() * 4);
    const consumptionValue = parseFloat((9 + (1.2 - base) * 2 + random()).toFixed(2));

    labels.push(timestamp);
    rpm.push(rpmValue);
    speed.push(speedValue);
    temperature.push(temperatureValue);
    consumption.push(consumptionValue);
  }

  return { labels, rpm, speed, temperature, consumption };
};
