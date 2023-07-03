const median = (arr) => {
  const nums = arr.map(parseFloat).sort((a, b) => b - a); // Sort in descending order
  const topTen = nums.slice(0, 10); // Get the top 10 largest numbers
  const sum = topTen.reduce((acc, num) => acc + num, 0); // Calculate the sum of the top 10 numbers
  return sum / topTen.length; // Calculate the average
};

module.exports = median;
