var data = [[[-406.39839918124954,785.0685520300113]],[[798.9372561650277,124.0792885659286]],[[-444.81997127519287,-219.99475846392068]],[[-198.2623132372904,516.0884025091859]],[[-571.6793303588698,306.4889335664153]],[[590.8286543550269,-86.36120434926946]]];

//$(".coordinate").css("height",$(window).height());
//控制点模糊度的显示大小
var shadowBlur = 50;
//控制点的大小
var circleSize = 15;
var option = {
    backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
        offset: 0,
        color: '#f7f8fa'
    }, {
        offset: 1,
        color: '#cdd0d5'
    }]),
    title: {
        text: 'k-means 坐标展示图',
        top : 10,
        left: 10
    },
    legend: {
        top : 10,
        right: 10,
        data: ['第一类', '第二类', '第三类', '第四类', '第五类', '第六类']
    },
    xAxis: {
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        scale: true
    },
    yAxis: {
    splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        scale: true
    },
    series: [
    {
        name: '第一类',
        data: data[0],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(251, 118, 123)'
                }, {
                    offset: 1,
                    color: 'rgb(204, 46, 72)'
                }])
            }
        }
    },
    {
        name: '第二类',
        data: data[1],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(110, 26, 40, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(118, 212, 227)'
                }, {
                    offset: 1,
                    color: 'rgb(89, 145, 154)'
                }])
            }
        }
    },
    {
        name: '第三类',
        data: data[2],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(96, 142, 212)'
                }, {
                    offset: 1,
                    color: 'rgb(50, 74, 109)'
                }])
            }
        }
    },
    {
        name: '第四类',
        data: data[3],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(230, 201, 85)'
                }, {
                    offset: 1,
                    color: 'rgb(130, 115, 55)'
                }])
            }
        }
    },
    {
        name: '第五类',
        data: data[4],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(173, 80, 179)'
                }, {
                    offset: 1,
                    color: 'rgb(83, 38, 86)'
                }])
            }
        }
    },
    {
        name: '第六类',
        data: data[5],
        type: 'scatter',
        symbolSize: circleSize,
        label: {
            emphasis: {
                show: true,
                 formatter: function (param) {
                    if(param.data.value){
                        return "["+param.data.value[0]+","+param.data.value[1]+"]";
                    }else{
                        return "["+param.data[0]+","+param.data[1]+"]";
                    }
                },
                position: 'top'
            }
        },
        itemStyle: {
            normal: {
                shadowBlur: shadowBlur,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: shadowBlur/2,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                    offset: 0,
                    color: 'rgb(204, 92, 58)'
                }, {
                    offset: 1,
                    color: 'rgb(109, 50, 33)'
                }])
            }
        }
    },
    ]
};
var myChart = echarts.init(document.getElementsByClassName('coordinate')[0]);
myChart.setOption(option,true);

window.onresize = function () {
    //$(".coordinate").css("height",$(window).height());
    myChart.resize();
}

function pointCircle(){
    var dataEntry = [];
    dataEntry.push(parseFloat($(".entry").eq(0)[0].value));
    dataEntry.push(parseFloat($(".entry").eq(1)[0].value));
    distance(dataEntry);
}

//计算距离的函数,并返回最小值的索引
function distance(dataEntry) {
    var dataEntry0 = {value: dataEntry,symbol: "triangle"}
    var distanceList = [];
    var sortDistanceList = [];
    var index = 0;
    for(var i=0,len=data.length; i< len; i++){
        var distance = Math.sqrt(Math.pow((data[i][0][0] - dataEntry[0]),2) + Math.pow((data[i][0][1] - dataEntry[1]),2));
        distanceList.push(distance);
    }
    sortDistanceList = distanceList.slice(0);
    sortDistanceList.sort(function(a,b){
        return a - b;
    });
    index = distanceList.indexOf(sortDistanceList[0]);
    data[index].push(dataEntry0);
    myChart.setOption(option,true);
    $(".tip").html("该点属于第" + (index+1) + "类");
}