
function assertTrue(x){
	if (!x){
		throw new Error("Not true: " + x)
	}
}
function assertEquals(x,y){
	if (x != y){
		throw new Error("Not equal: " + x + ", " + y);
	}
}

function assertInList(x, lst){
	for (var i = 0; i < lst.length; i++) {
		if(lst[i] == x){
			return;
		}
	}
	throw new Error("Not in : " + x + ", " + lst);
}