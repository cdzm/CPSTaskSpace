        var dataFinal = [{"name": "根节点","属性":2,"children":[]}];

        function searchNote(dataInit,children){
            if (dataInit['子节点']) {
                for(var key in dataInit['子节点']) {
                    var object = {};
                    object['name'] = key;
                    if (dataInit['子节点'][key]['子节点']) {
                        object['属性'] = dataInit['子节点'][key]['属性'];
                        object.children = [];
                        children.push(object);
                        searchNote(dataInit['子节点'][key], object.children);
                    } else {
                        object['value'] = dataInit['子节点'][key]['值'];
                        children.push(object);
                    }
                }
            }
        }

        $.ajax({
            type: "GET",
            url: "./ID3.txt",
            dataType: "json",
            success: function(data){
                console.log(data);
                searchNote(data, dataFinal[0].children);
                console.log(dataFinal);

            }
        });

        require.config({
            paths: {
                echarts: './jsLibraries/echarts-2.2.7/build/dist'
            }
        });

        // 使用
        require(
            [
                'echarts',
                'echarts/chart/tree' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('ID3Tree'));

                var option = {
                    title : {
                        text: 'ID3Result'
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                        {
                            name:'树图',
                            type:'tree',
                            orient: 'horizontal',  // vertical horizontal
                            rootLocation: {x: 100,y: 333}, // 根节点位置  {x: 100, y: 'center'}
                            nodePadding: 3,
                            layerPadding: 200,
                            hoverable: false,
                            roam: true,
                            symbolSize: 10,
                            itemStyle: {
                                normal: {
                                    color: '#4883b4',
                                    label: {
                                        show: true,
                                        position: 'right',
                                        formatter: "{b}",
                                        textStyle: {
                                            color: '#000',
                                            fontSize: 10
                                        }
                                    },
                                    lineStyle: {
                                        color: '#ccc',
                                        type: 'curve' // 'curve'|'broken'|'solid'|'dotted'|'dashed'

                                    }
                                },
                                emphasis: {
                                    color: '#4883b4',
                                    label: {
                                        show: false
                                    },
                                    borderWidth: 0
                                }
                            },

                            data: dataFinal
                        }
                    ]
                };


                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        );
