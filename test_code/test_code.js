function findMax(numbers) {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max; // 最大値を返す
}

console.log(findMax([3, 7, 2, 9, 1])); // 9