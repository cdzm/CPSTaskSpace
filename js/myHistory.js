/**
 * Created by FSL on 2016/10/9.
 *
 */
$(function () {
  var baseUrl = "";
  //屏蔽alert；
  window.alert = function (e) {
    return;
  };

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

  /*
   //grid.exportFile('excel');*/
  var datas = [];

  var gridColumns = [
    {
      id: 'appname',
      title: '算法名',
      type: 'string',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      fastQuery: true,
      fastQueryType: 'eq'
    },
    {
      id: 'jobid',
      title: '任务id',
      type: 'string',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      fastQuery: true,
      fastQueryType: 'eq'
    },
    {
      id: 'jobname',
      title: '任务名',
      type: 'string',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      fastQuery: true,
      fastQueryType: 'eq'
    },
    {
      id: 'owner',
      title: '任务提交者',
      type: 'string',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      fastQuery: true,
      fastQueryType: 'lk'
    },
    // {id:'task_end_time', title:'结束时间', type:'date', format:'yyyy-MM-dd hh:mm:ss', columnClass:'text-center', headerStyle:'background:#00a2ca;color:white;',fastQuery:true, fastQueryType:'range'},
    {
      id: 'status',
      title: '任务状态',
      type: 'string',
      format: '#,###.00',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      fastQuery: true,
      fastQueryType: 'lk',
      resolution: function (value, record, column, grid, dataNo, columnNo) {
        var content = '';
        if (value === "FINISHED") {
          content += '<span style="background:#00a2ca;padding:2px 10px;color:white;">完成</span>';
        } else if (value === "ERROR") {
          content += '<span style="background:#666699;padding:2px 10px;color:white;">失败</span>';
        } else if (value === "RUNNING") {
          content += '<span style="background:#009999;padding:2px 10px;color:white;">运行中</span>';
        }
        return content;
      }
    },
    {
      id: 'operation',
      title: '操作',
      type: 'string',
      columnClass: 'text-center',
      headerStyle: 'background:#00a2ca;color:white;',
      resolution: function (value, record, column, grid, dataNo, columnNo) {
        var content = '';
        content += '<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i> 删除</button>';
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
    exportURL: './../js/dlshouwengrid/app/export.php',
    //tools : 'refresh|print|fastQuery|advanceQuery|export[excel,csv,pdf,txt]',
    tools: 'refresh|print|fastQuery|advanceQuery',
    pageSizeLimit: [5, 10, 20, 30, 50],
    onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
      //var no = dataNo;
      if (columnNo == 5) {
        console.log(record)
        alertify.confirm("确定要删除文件", function (e) {
          if (e) {
            var timestamp = new Date().getTime();
            $.ajax({
              type: "DELETE",
              url: baseUrl + "/API/spark/delete_jobrec/" + record.jobid + '/' + token + '/' + timestamp,
              success: function () {
              },
              error: function (XMLHttpRequest, textStatus) {
                $('#alert_info').html(XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status]);
                $('#myAlert').slideDown(500);
              }

            })
          } else {

          }
        });
      }
    }
  };


  //递归查询任务
  function get_task(jobs, deferred, page) {
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
        console.log(data);
        var jobArry = data;
        if (data.length === 0) {
          deferred.resolve();
        } else {
          for (var i = 0; i < jobArry.length; i++) {
            var data_grid = {};
            data_grid.appname = jobArry[i]["appName"];
            data_grid.jobid = jobArry[i]["jobid"];
            data_grid.jobname = jobArry[i]["classPath"];
            data_grid.owner = jobArry[i]["owner"];
            data_grid.status = jobArry[i]["status"];
            jobs[jobArry[i]["jobid"]] = jobArry[i].result;
            datas.push(data_grid);
          }
          get_task(jobs, deferred, page + 1);
        }
      },
      error: function (XMLHttpRequest, textStatus) {
        $('#alert_info').html(XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status]);
        $('#myAlert').slideDown(500);
      }
    });
  }

  //异步管理
  var deferred = $.Deferred();
  get_task(datas, deferred, 1);
  deferred.done(function () {
    var grid = $.fn.dlshouwen.grid.init(gridOption);
    grid.load();
  });

});
