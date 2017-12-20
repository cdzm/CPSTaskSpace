$(function(){
    $("#input_file").change(function(){
        var  fileArry = [];
        var  fileNames=[];
        var  inputFileLength;
        var  inputFile = document.getElementById('input_file');

        //检测浏览器是否支持fileReader
        if(typeof FileReader == "undefined"){
            alert("您的浏览器不支持FileReader!!(请使用chrome或firefox或是能较好支持html5的浏览器)");
            inputFile.setAttribute("disabled","disabled");
        }

        inputFileLength = inputFile.files.length;
        for(var i=0;i<inputFileLength;i++){
            fileArry.push(inputFile.files[i]);
            fileNames.push(inputFile.files[i].name);
        }
        var nameStr = fileNames.join(",");
        var numStr = "选中"+inputFileLength+"个文件.";
        $(".file-caption-name").html(numStr+nameStr);
    });
});

