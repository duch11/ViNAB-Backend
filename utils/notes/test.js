console.log("Test sheet");

const TEST = 2;

if(TEST === 1){
    function1();

    function function1() {
        console.log("function 1 ran...");
        function2();
    }
    
    function function2() {
        console.log("Function 2 ran!");
    }
}

//scope
if(TEST === 2){
    runtest2();

    function runtest2(){
        let a1 = "a1";
        var b1 = "b1"; //global?
        function1();

        function function1() {
            let a2 = "a2";
            var b2 = "b2";
            console.log("f1 " + a1 + b1 +a2+ b2);
            function2(a2,b2);
        }

        function function2(a2,b2) {
            console.log("f2 " + a1 + b1 + a2 + b2);
        }
        
    }    
}



