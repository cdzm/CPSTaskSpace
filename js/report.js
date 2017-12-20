/**
 * Created  on 2016/10/10.
 */
$(function () {
  var baseUrl = "";
//token，http_state_code
  var token = sessionStorage.getItem('token');
  var http_state_code = {
    204: "no content 无内容",
    205: "reset content 重置内容",
    400: "Bad request 错误的请求",
    403: "forbidden 禁止访问",
    404: "not found 未找到请求内容",
    405: "method not allowed 请求方法不能被用于请求相应的资源",
    413: "request entity too long 请求实体太长",
    414: "request-url too long 请求URL太长",
    415: "unsupported media type 不支持的媒体类型",
    417: "expectation failed 执行失败",
    500: "internal server error 服务器内部错误",
    501: "not implemented 服务器无法完成请求",
    502: "Bad Gateway 收到无效响应",
    503: "service unavailable 服务不可用",
    504: "Gatewany timeout 网关超时",
    505: "http版本不支持"
  };


  //任务查询点击
  $('#task_search').click(function () {
    //查询任务
    //递归查询任务
    var jobArry = {};
    var divArry = [];

    function get_task(jobs, divArry, page) {
      var timestamp = new Date().getTime();
      $.ajax({
        type: 'get',
        url: baseUrl + '/API/spark/getJobs',
        dataType: 'json',
        //data:query,
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Accept", "application/json");
          XMLHttpRequest.setRequestHeader("token", token);
          XMLHttpRequest.setRequestHeader("page", page);
        },
        success: function (data) {
          var jobArry = data;
          console.log(data);
          if (data.length === 0) {
            $('#head_content_tbody').html(divArry);
          } else {
            for (var i = 0; i < jobArry.length; i++) {
              var classPath = '<td >' + jobArry[i]["classPath"] + '</td>';
              var jobid = '<td  class="pointer"><a class="jobid" id=' + i + ' >' + jobArry[i]["jobid"] + '</a></td>';
              var appname = '<td>' + jobArry[i]["appName"] + '</td>';
              var status = jobArry[i]["status"] == "FINISHED" ? '<td style="color: #00a2ca">完成</td>' : jobArry[i]["status"] == "RUNNING" ? '<td style="margin-left: 74%;color: #33CC00">运行中</td>':jobArry[i]["status"] == "STARTED" ? '<td style="margin-left: 74%;color: #33CC00">运行中</td>' : '<td style="margin-left: 74%;color: red">失败</td>';
              var div = '<tr>' + appname + jobid + classPath + status + '</tr>';
              divArry.push(div);
              jobs[jobArry[i]["jobid"]] = {
                "appName": jobArry[i].appName,
                "classPath": jobArry[i].classPath,
                "status": jobArry[i].status
              };
            }
            get_task(jobs, divArry, page + 1);
          }
        },
        error: function (XMLHttpRequest, textStatus) {
          $('#alert_info').html(XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status]);
          $('#myAlert').slideDown(500);
        }
      });
    }

    get_task(jobArry, divArry, 1);
    $("#head_content_tbody").on("click", ".jobid", function () {
      $(this).addClass('yellow');
      $(".jobid").removeClass('yellow');
      var my_id = $(this).html();
      console.log(my_id);
      console.log(jobArry);
      var result = {};
      //result.classPath = "Clustering.Kmeans";
      result.classPath = jobArry[my_id]["appName"];
      result.status = jobArry[my_id]["status"];
      $.ajax({
        url: baseUrl + "/API/spark/getJobById",
        type: "get",
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Accept", "application/json");
          XMLHttpRequest.setRequestHeader("token", token);
          XMLHttpRequest.setRequestHeader("jobid", my_id);
        },
        success: function (data) {
          result.result = data;
          console.log(result);
          showResult = JSON.parse(JSON.parse(data)['result'])['result'];
          if (result.status == "RUNNING"||result.status=="STARTED") {
            $('#job_result').html('任务正在执行中哦');
          } else if (result.status == "FINISHED") {
            if (result.classPath == "Clustering.Kmeans") {
              var ClusterResult = JSON.parse(showResult);
              var data = [];
              var dimension = ClusterResult["聚类的中心"][0].length;
              for (var i = 0, len = ClusterResult["聚类的中心"].length; i < len; i++) {
                var object = {};
                object["聚类的中心"] = ClusterResult["聚类的中心"][i];
                object["聚类的属性"] = ClusterResult["聚类的属性"][i];
                data.push(object);
              }
              console.log(data);
              if (dimension != 2) {
                $('#job_result').html('');
                $('#result_data_info').html('');
                $('#resultToolBarContainer_data_info').html('');
                var gridColumn = [{
                  id: '聚类的中心',
                  title: '聚类中心',
                  columnClass: 'text-center',
                  type: 'string',
                  width: '80%'
                }, {id: '聚类的属性', title: '聚类属性', columnClass: 'text-center', type: 'string', width: '20%'}];
                var gridOption = {
                  lang: 'zh-cn',
                  ajaxLoad: false,
                  exportFileName: 'zwj',
                  datas: data,
                  columns: gridColumn,
                  gridContainer: 'result_data_info',
                  toolbarContainer: 'resultToolBarContainer_data_info',
                  tools: '',
                  pageSize: 10
                };
                console.log(gridOption);
                var grid = $.fn.dlshouwen.grid.init(gridOption);
                grid.load();
              } else {
                confirm("What kind of show would you like to choose", '', function (isConfirm) {
                  if (isConfirm) {
                    showKmeans(showResult);
                    $('#coordinateModal').modal('show');
                  } else {
                    $('#result_data_info').html('');
                    $('#resultToolBarContainer_data_info').html('');
                    $('#job_result').html(showResult);
                  }
                }, {confirmButtonText: "scatter", cancelButtonText: "message", width: 400});
              }
            } else if (result.classPath == "DataMining.ID3") {
              confirm("", 'What kind of show would you like to choose', function (isConfirm) {
                if (isConfirm) {
                  showID3(JSON.parse(showResult));
                  $('#ID3TreeModal').modal('show');
                } else {
                  $('#result_data_info').html('');
                  $('#resultToolBarContainer_data_info').html('');
                  console.log(JSON.stringify(JSON.parse(showResult), null, "    "));
                  $('#job_result').html(showResult);
                }
              }, {confirmButtonText: "treeMap", cancelButtonText: "message", width: 400});
            } else if (result.classPath == "Regression.SelfRelation") {
              $('#result_data_info').html('');
              $('#resultToolBarContainer_data_info').html('');
              $('#job_result').html(showResult);
            } else if (result.classPath == "Regression.CoRelation") {
              $('#result_data_info').html('');
              $('#resultToolBarContainer_data_info').html('');
              $('#job_result').html(showResult);
            } else if (result.classPath == "DataMining.PrefixSpan") {
              $('#result_data_info').html('');
              $('#resultToolBarContainer_data_info').html('');
              $('#job_result').html(showResult);
            } else if (result.classPath == "DataMining.FPGrowth") {
              $('#result_data_info').html('');
              $('#resultToolBarContainer_data_info').html('');
              $('#job_result').html(showResult);
            }
          } else {
            $('#job_result').html('任务失败，请检查所选文件是否负荷要求，参数是否输入正确');
          }
        },
        error: function (error) {
          console.log(error);
        }
      });
      console.log();
    });
    //k-means可视化展示
    function showKmeans(ClusterResult) {
      ClusterResult = JSON.parse(ClusterResult);
      //控制点模糊度的显示大小
      var shadowBlur = 50;
      //控制点的大小
      var circleSize = 15;
      //数据结果处理
      var data = ClusterResult["聚类的中心"];
      console.log(data);
      var dataEchart = [];
      var seriesEchart = [];
      var legend = [];
      var dataProperty = ClusterResult["聚类的属性"];
      //处理数据到dataEchart中
      for (var i = 0, len = data.length; i < len; i++) {
        var dataCategory = [];
        dataCategory.push(data[i]);
        dataEchart.push(dataCategory);
        legend.push('第' + (i + 1) + '类');
      }
      console.log(dataEchart);
      console.log(dataProperty);
      for (var i = 0, len = dataEchart.length; i < len; i++) {
        var seriesOption = {
          name: '第' + (i + 1) + '类',
          data: dataEchart[i],
          type: 'scatter',
          symbolSize: circleSize,
          label: {
            emphasis: {
              show: true,
              formatter: function (param) {
                if (param.data.value) {
                  return "[" + param.data.value[0] + "," + param.data.value[1] + "]";
                } else {
                  return "[" + param.data[0] + "," + param.data[1] + "]";
                }
              },
              position: 'top'
            }
          },
          itemStyle: {
            normal: {
              shadowBlur: shadowBlur,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: shadowBlur / 2
            }
          }
        };
        seriesEchart.push(seriesOption);
      }
      console.log(seriesEchart);


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
          top: 10,
          left: 10
        },
        legend: {
          top: 10,
          right: 10,
          data: legend
        },
        xAxis: {
          name: dataProperty[0],
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        yAxis: {
          name: dataProperty[1],
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          scale: true
        },
        series: seriesEchart
      };
      console.log(option);
      var myChart = echarts.init(document.getElementsByClassName('coordinate')[0]);
      myChart.setOption(option, true);

      window.onresize = function () {
        $(".coordinate").css("height", $(window).height());
        myChart.resize();
      };

      function pointCircle() {
        var dataEntry = [];
        dataEntry.push(parseFloat($(".entry").eq(0)[0].value));
        dataEntry.push(parseFloat($(".entry").eq(1)[0].value));
        distance(dataEntry);
      }

      //计算距离的函数,并返回最小值的索引
      function distance(dataEntry) {
        var dataEntry0 = {value: dataEntry, symbol: "triangle"};
        var distanceList = [];
        var sortDistanceList = [];
        var index = 0;
        for (var i = 0, len = dataEchart.length; i < len; i++) {
          var distance;
          for (var j = 0, len1 = datadataEchart[0].length; j < len1; j++) {
            distance += Math.sqrt(Math.pow((dataEchart[i][0][i] - dataEntry[i]), 2));
          }
          distanceList.push(distance);
        }
        sortDistanceList = distanceList.slice(0);
        sortDistanceList.sort(function (a, b) {
          return a - b;
        });
        index = distanceList.indexOf(sortDistanceList[0]);
        dataEchart[index].push(dataEntry0);
        myChart.setOption(option, true);
        $(".tip").html("该点属于第" + (index + 1) + "类");
      }
    }

    function showID3(showResult) {
      console.log(showResult);
      var dataFinal = [{"name": "根节点", "属性": 2, "children": []}];
      var csv = showResult["csv对应的列序号"];
      console.log(csv);
      var csvArray = [], csvOrder = [];
      for (var key in csv) {
        csvArray.push(key);
        csvOrder.push(csv[key]);
      }
      console.log(csvArray);
      console.log(csvOrder);
      var index = csvOrder.indexOf(showResult["属性"]);
      dataFinal[0]["name"] = "根节点" + '   ' + csvArray[index];

      function searchNote(dataInit, children) {
        if (dataInit['子节点']) {
          for (var key in dataInit['子节点']) {
            var object = {};
            object['name'] = key + '   ' + showResult["目标属性"] + ' = ' + dataInit['子节点'][key]['值'];
            if (dataInit['子节点'][key]['子节点']) {
              object['属性'] = dataInit['子节点'][key]['属性'];
              var index0 = csvOrder.indexOf(object['属性']);
              object['name'] = key + '   '+ csvArray[index0];
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

      searchNote(showResult, dataFinal[0].children);

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
            title: {
              text: 'ID3Result'
            },
            toolbox: {
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            },
            series: [
              {
                name: '树图',
                type: 'tree',
                orient: 'horizontal',  // vertical horizontal
                rootLocation: {x: 100, y: 333}, // 根节点位置  {x: 100, y: 'center'}
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

    }
  });

  /*//定时刷新浏览器
   setInterval(function(){
   location.reload(true);
   console.log("1234567");
   },20000);
   setTimeout(function(){
   $('#task_search').click();
   },1000);*/

});
