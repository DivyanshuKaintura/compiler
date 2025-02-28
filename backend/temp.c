#include<stdio.h>
int main() {
  int x;
  scanf("%d", &x);
  int arr[x];
  for (int i=0; i<x; i++) {
    scanf("%d", &arr[i]);
  }
  int sum = 0;
  for (int i=0; i<x; i++) {
    sum += arr[i];
  }
  printf("Sum: %d\n", sum);
  return 0;
}