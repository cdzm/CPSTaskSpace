/**
 * Created on 2016/10/8.
 */
$(function () {
  //
  var baseUrl = "";

//token，http_state_code
  var token = sessionStorage.getItem('token');
  console.log(token);
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

  //GB,MB,KB
  function getSize(size) {
    var kb = (size / 1024).toFixed(2);
    var mb = (size / (1024 * 1024)).toFixed(2);
    var gb = (size / (1024 * 1024 * 1024)).toFixed(2);
    return (gb > 1) ? gb + "GB" : (mb > 1) ? mb + "MB" : kb + "KB";
  }

  //传给后台的json
  var mainJson = {};
  mainJson.appName = "";
  mainJson.classPath = "";
  mainJson.token = token;
  mainJson.body = {
    "paras": {},
    "type": "hdfs",
    "hdfspath": ""
  };

//data_info的表格
  var datas_grid_data_info = [];

  function grid_load_data_info(datas) {
    var gridColumns = [
      {
        id: 'filename',
        title: '数据名',
        type: 'string',
        columnClass: 'text-center',
        headerStyle: 'background:#00a2ca;color:white;',
        fastQuery: true,
        fastQueryType: 'eq'
      },
      {
        id: 'column_data_info',
        title: '列',
        type: 'string',
        columnClass: 'text-center',
        headerStyle: 'background:#00a2ca;color:white;',
        fastQuery: true,
        fastQueryType: 'lk'
      },
      {
        id: 'operation',
        title: '操作',
        type: 'string',
        columnClass: 'text-center',
        headerStyle: 'background:#00a2ca;color:white;',
        resolution: function (value, record, column, grid, dataNo, columnNo) {
          var content = '';
          content += '<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i>删除</button>';
          return content;
        }
      }
    ];
    var gridOption_data_info_temp = {
      lang: 'zh-cn',
      ajaxLoad: false,
      exportFileName: 'zwj',
      datas: datas,
      columns: gridColumns,
      gridContainer: 'gridContainer_data_info',
      toolbarContainer: 'gridToolBarContainer_data_info',
      pageSize: 10,
      tools: 'refresh|print|fastQuery|advanceQuery',
      pageSizeLimit: [5, 10, 15, 20],
      onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
        //var no = dataNo;
        //删除文件
        if (columnNo == 2) {
          var filename = record.filename;
          alertify.confirm("确定要删除文件", function (e) {
            if (e) {
              datas.splice(dataNo, 1);
              grid_data_info.reload(true);
            } else {
            }
          });
        }
      }
    };
    return gridOption_data_info_temp;
  }

  var gridOption_data_info = grid_load_data_info(datas_grid_data_info);
  var grid_data_info = $.fn.dlshouwen.grid.init(gridOption_data_info);//训练数据集表格
  grid_data_info.load();

//隐藏参数设置
  $('#right_parameter_close').click(function () {
    $('#right_parameter').hide(300);
    $('#task').stop(1000).animate({width: '100%'});
  });

//task85
  $('.panel-body-suanfa').on("click" , ".task85", function () {
    $('#task').animate({width: '85%'});
    $('#right_parameter').show(1000);
  });

//practice_data 训练数据集
  $('#practice_data').click(function () {
    $('#practiceDataModal').modal({backdrop: 'static', keyboard: false});
    function ls() {
      //数据源列表，表格,列出指定目录下所有的文件和文件夹
      var timestamp = new Date().getTime();
      var dfs_ls = $.ajax({
        type: "get",
        url: baseUrl + "/API/dfs/ls",
        dataType: 'json',
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("path", "/");
          XMLHttpRequest.setRequestHeader("token", token);
        },
        success: function (data) {
          console.log(data);
        },
        error: function (XMLHttpRequest) {
          var str = '<div style="color: red;font-family: "microsoft yahei"">' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
          if (XMLHttpRequest.status == '500') {
            alertify.alert(str);
          } else {
            alertify.alert(str);
          }
        }
      });

      $.when(dfs_ls).done(function (data0) {
        console.log(data0);
        var data_dfs = data0;
        var datas_grid = [];
        var filename = "";
        var owner = "";
        var length = 0;
        if (data_dfs.hasOwnProperty("result")) {
          data_dfs = data_dfs["result"];
          console.log("data_dfs", data_dfs);
          for (var i = 0; i < data_dfs.length; i++) {
            var data_grid = {};
            filename = data_dfs[i]["name"];
            owner = data_dfs[i]["owner"];
            length = getSize(data_dfs[i]["length"]);
            data_grid.filename = decodeURI(filename);
            data_grid.owner = owner;
            data_grid.length = length;
            datas_grid.push(data_grid);
          }
        } else {
          alertify.alert("JSON错误，不存在details键");
        }
        function grid_load(datas) {
          var gridColumns = [
            {
              id: 'filename',
              title: '数据名',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'eq'
            },
            {
              id: 'owner',
              title: '所有者',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'lk'
            },
            {
              id: 'length',
              title: '数据量',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'lk'
            },
            {
              id: 'operation',
              title: '操作',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              resolution: function (value, record, column, grid, dataNo, columnNo) {
                var content = '';
                if (record.owner) {
                  content += '<button class="btn btn-xs btn-danger"><i class="fa fa-eye">确认数据</i></button>';
                } else {
                  content += '<button class="btn btn-xs btn-danger"><i class="fa fa-eye">表头信息</i></button>';
                }

                return content;
              }
            }
          ];
          var gridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            exportFileName: 'zwj',
            datas: datas,
            columns: gridColumns,
            gridContainer: 'gridContainer',
            toolbarContainer: 'gridToolBarContainer',
            pageSize: 10,
            //exportURL:'./../js/dlshouwengrid/app/export.php',
            //tools : 'refresh|print|fastQuery|advanceQuery|export[excel,csv,pdf,txt]',
            tools: 'refresh|print|fastQuery|advanceQuery',
            pageSizeLimit: [5, 8, 12, 16],
            onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
              var filename = record.filename;
              console.log(record);
              //表头信息
              if (columnNo == 3) {
                if (record.owner) {
                  alertify.alert("你一共选中了" + filename);
                  var data_grid_data_info = {};
                  data_grid_data_info.filename = filename;

                  datas_grid_data_info[0] = data_grid_data_info;
                  grid_data_info.reload(true);
                  //$('#practiceDataModal').modal("hide");
                }
              }
            }
          };
          var grid = $.fn.dlshouwen.grid.init(gridOption);
          grid.load();
        }

        $("#gridContainer").html("");
        grid_load(datas_grid);
      })
    }
    ls();
  });

  //保存所有的算法
  var allAlgorithm = [];

//请求算法包
  $.ajax({
    type: "get",
    url: baseUrl + "/API/spark/getAvailablePackages",
    dataType: 'json',
    beforeSend: function (XMLHttpRequest) {
      XMLHttpRequest.setRequestHeader("Accept", "application/json");
      XMLHttpRequest.setRequestHeader("token", token);
    },
    success: function(data){
      console.log(data);
      var algorithmBar = JSON.parse(data["message"]);
      var text = "";
      for(var i = 0,len = algorithmBar.length; i < len; i++){
        var appName = algorithmBar[i]["appName"];
        $.ajax({
          type: "get",
          url: baseUrl + "/API/spark/getAlgorithmsUnderPackage",
          beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
            XMLHttpRequest.setRequestHeader("token", token);
            XMLHttpRequest.setRequestHeader("appName", appName);
          },
          success: function(data){
            console.log(data)
            //如果返回list，直接插入，如果不是变成list
            for(var i = 0 , len1 = data.length; i < len1; i++){
              allAlgorithm.push(data[i]);
              text += "<div class='list' style='width:100%;height: 50px;padding-left: 5px;font-size:12px;padding-top: 5px' ><i class='fa fa-circle'></i>&nbsp;<span class='pointer task85' style='text-align:center;'>" + data[i]["displayname"] + "</span></div>";
            }
            $('.panel-body-suanfa').html(text);
          },
          error: function(error){
            console.log(error)
          }
        });
      }

    },
    error: function(error){
      console.log(error);
    }
  });

  //为所有算法绑定click事件
  $(".panel-body-suanfa").on("click",".list", function() {
    var index = $(this).index();
    console.log(index);
    //算法选择
    mainJson.appName = allAlgorithm[index]["appName"];
    console.log(mainJson.appName);
    mainJson.classPath = allAlgorithm[index]["classPath"];
    console.log(mainJson.classPath);

    //添加说明
    var explain = allAlgorithm[index]["description"];
    $('#parameter_explain_div').html(explain);
    $('#parameter_head_title')
    var text = "";
    var show = "";
    //添加输入参数
    var arrInput = JSON.parse(allAlgorithm[index]["inputDescription"]);
    console.log(arrInput)
    for(var i = 0, len = arrInput.length; i < len; i++){
      if(arrInput[i]["required"]){
        text += '<div>'+arrInput[i]["displayname"]+"<input type='text' id='parameterInput' class='index' /></div><br><span>必须</span>&nbsp&nbsp<span>参数类型："+ arrInput[i]["type"] +'</span><br><br>';
        show += '<span>' + arrInput[i]["displayname"] + "=</span><span class='showParameter'></span><br><br></span>";
      }else{
        text += '<div>'+arrInput[i]["displayname"]+"<input type='text' id='parameterInput' class='index' /></div><br><span>不必须</span>&nbsp&nbsp<span>参数类型："+ arrInput[i]["type"] +'</span><br><br>';
        show += '<span>' + arrInput[i]["displayname"] +"=</span><span class='showParameter'></span><br><br></span>";
      }
    }
    $('#parameter_para_div').html(text);
    $('#model_info').html(allAlgorithm[index]["displayname"]);
    $('#model_para_info').html(show);
    $('#parameter_para_div').on('input propertychange', '#parameterInput', function(){
      console.log(this);
      var inputIndex = $('.index').index(this);
      var value = $(this).val();
      $('.showParameter').eq(inputIndex).html(value);
      var paras = arrInput[inputIndex]["name"];
      mainJson.body["paras"][paras] = value;
      console.log(mainJson);
    });
  });

//task_run,提交任务
  $('#task_run').click(function () {
    if (datas_grid_data_info.length === 0) {
      alertify.alert("请先选择数据！");
    } else {
      for (var i = 0; i < datas_grid_data_info.length; i++) {
        var index = datas_grid_data_info[i]["filename"];
      }
      mainJson["body"]["hdfspath"] = '/' + index;
      var main_Json = {
        "appName": mainJson.appName,
        "classPath": mainJson.classPath,
        "token": token,
        "body": JSON.stringify(mainJson["body"])
      };
      console.log(main_Json);
      var timestamp = new Date().getTime();
      $.ajax({
        type: 'post',
        url: baseUrl + '/API/spark/submitJob',
        dataType: 'json',
        data: main_Json,
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {
          var status = data['status'];
          var jobId = data['jobId'];
          $('#taskSubmitModal').modal("toggle");
          $("#model_task_id").html(jobId);
        },
        error: function (XMLHttpRequest, textStatus) {
          if (XMLHttpRequest.status == '500') {
            $('#alert_info').html(XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status]);
            $('#myAlert').slideDown(1000);
          } else {
            //alert(XMLHttpRequest.status+":"+http_state_code[XMLHttpRequest.status]);`
            $('#alert_info').html(XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status]);
            $('#myAlert').slideDown(1000);
          }
        }
      })
    }
  });

//task_clear，清空
  $('#task_clear').click(function () {
    datas_grid_data_info.splice(0, datas_grid_data_info.length);
    grid_data_info.reload(true);
    $('#feature_info').html('');
    $('#model_info').html('');
    $('#model_para_info').html('');
  });

});
