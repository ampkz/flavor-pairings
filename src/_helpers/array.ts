export function isSortedAlphabetically(arr: { name: string }[]) {
	if (arr.length <= 1) {
		return true;
	}

	for (let i = 1; i < arr.length; i++) {
		if (arr[i - 1]!.name.localeCompare(arr[i]!.name) > 0) {
			return false;
		}
	}
	return true;
}
