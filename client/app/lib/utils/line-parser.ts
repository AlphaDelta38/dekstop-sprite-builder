function parseLine(line: string): [string, any] {
  if (!line.includes(":")) return [line, null];

  const [key, value] = line.split(":").map((item) => item.trim());
  
  const transformetValue = value.includes(",") ? value.split(",").map((item: string) => item.trim()) : value;
  
  return [key, transformetValue];
}

export default parseLine;