/**
 * Created  on 2016/10/10.
 */
$(function () {
  //绝对地址
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

//    unix时间转年月日
  function getTime(timestamp) {
    var data = new Date(timestamp);
    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    var date = data.getDate();
    var hours = data.getHours();
    var minutes = data.getMinutes();
    var seconds = data.getSeconds();
    var dateStr = year + "年-" + month + "月-" + date + "日" + " , " + hours + "点" + minutes + "分" + seconds + "秒";
    return dateStr;
  }

//花费时间：
  function remainingTime(needTime) {
    var sec = parseInt(needTime / 1000);
    if (sec < 60) {
      return sec;
    } else {
      var min = parseInt(sec / 60);
      if (min < 60) {
        return min + ":" + (sec % 60);
      } else {
        var hour = parseInt(min / 60);
        if (hour < 24) {
          return hour + ":" + min % 60 + ":" + sec % 60;
        } else {
          return parseInt(hour / 24) + "天" + hour % 24 + ":" + min % 60 + ":" + sec % 60;
        }
      }
    }
  }

//GB,MB,KB
  function getSize(size) {
    var kb = (size / 1024).toFixed(2);
    var mb = (size / (1024 * 1024)).toFixed(2);
    var gb = (size / (1024 * 1024 * 1024)).toFixed(2);
    return (gb > 1) ? gb + "GB" : (mb > 1) ? mb + "MB" : kb + "KB";
  }

//判断后缀
  function suffix(str) {
    var temp = str.split(".");
    var length = temp.length;
    return temp[length - 1];
  }

//数据源列表，表格,列出指定目录下所有的文件和文件夹
  function ls() {
    //数据源列表，表格,列出指定目录下所有的文件和文件夹
    var timestamp = new Date().getTime();
    $.ajax({
      type: "get",
      url: baseUrl + "/API/dfs/ls",
      dataType: 'json',
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Accept", "application/json");
        XMLHttpRequest.setRequestHeader("path", "/");
        XMLHttpRequest.setRequestHeader("token", token);
      },
      success: function (data) {
        var datas_grid = [];
        console.log(data)
        var details = data["result"];
        console.log("details:", details);
        var filename = "";
        var owner = "";
        var length = 0;
        var last_Modify = "";
        var type = "";

        for (var i = 0; i < details.length; i++) {
          var data_grid = {};
          filename = details[i]["name"];
          owner = details[i]["owner"];
          length = getSize(details[i]["length"]);
          last_Modify = details[i]["last_Modify"];
          console.log(last_Modify);
          last_Modify = last_Modify.replace("年", "").replace("月", "").replace("日", "").replace("时", ":").replace("分", ":").replace("秒", "").replace("点", ":");
          last_Modify = new Date(last_Modify).getTime() - 1000 * 60 * 60 * 8;
          last_Modify = getTime(last_Modify);
          type = details[i]["type"];
          data_grid.filename = decodeURI(filename);
          data_grid.owner = owner;
          data_grid.length = length;
          data_grid.last_Modify = last_Modify;
          data_grid.type = type;
          datas_grid.push(data_grid);
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
              title: '数据大小',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'lk'
            },
            {
              id: 'last_Modify',
              title: '导入时间',
              type: 'date',
              format: 'yyyy-MM-dd hh:mm:ss',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'range'
            },
            {
              id: 'type',
              title: '类型',
              type: 'string',
              format: 'text-center',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              fastQuery: true,
              fastQueryType: 'lk'
            },
            {
              id: 'lookData',
              title: '查看数据',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              resolution: function (value, record, column, grid, dataNo, columnNo) {
                var content = '';
                content += '<button class="btn btn-xs btn-danger">表头信息</button>';
                return content;
              }
            },            {
              id: 'operation',
              title: '操作',
              type: 'string',
              columnClass: 'text-center',
              headerStyle: 'background:#00a2ca;color:white;',
              resolution: function (value, record, column, grid, dataNo, columnNo) {
                var content = '';
                content += '<button class="btn btn-xs btn-danger"><i class="fa fa-trash-o"></i>  删除</button>';
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
            pageSizeLimit: [5, 10, 15, 20],
            onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
              //var no = dataNo;
              //删除文件
              var fileName = record.filename;
              if (columnNo == 6) {
                alertify.confirm("确定要删除文件", function (e) {
                  if (e) {
                    var ajax = del(record.filename);
                    $.when(ajax).done(function (data) {
                      //console.log("rm_data:",data);
                      //console.log("fileNames:",record.filename);
                      if (data["succeed"] === true) {
                        datas.splice(dataNo, 1);
                        grid.reload(true);
                      } else {
                        alertify.alert(data["message"]);
                      }
                    })
                  } else {
                  }
                });
              }
              //点击预览
              if (columnNo == 5) {
                $.ajax({
                  url: baseUrl + "/API/dfs/preview",
                  type: "get",
                  beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json");
                    XMLHttpRequest.setRequestHeader("path", "/" + encodeURI(fileName));
                    XMLHttpRequest.setRequestHeader("token", token);
                  },
                  success: function(data){
                    console.log(JSON.stringify(data));
                    $('.lookdata').html(data);
                    $('#lookdata').modal('show');
                  },
                  error: function (error) {
                    console.log(error);
                  }
                });
              }
            }
          };
          var grid = $.fn.dlshouwen.grid.init(gridOption);
          grid.load();
        }

        $("#gridContainer").html("");
        grid_load(datas_grid);
      },
      error: function (XMLHttpRequest) {
        var str = '<div style="color: red;font-family: "microsoft yahei"">' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
        if (XMLHttpRequest.status == '500') {
          //alert("暂时没有数据");
          //alertify.alert(str);
        } else {
          //alert(XMLHttpRequest.status+":"+http_state_code[XMLHttpRequest.status]);
          //alertify.alert(str);
        }
      }
    });
  }

  ls();

  function es_ls() {
    //查询es的数据
    var timestamp = new Date().getTime();
    var es = $.ajax({
      type: "get",
      url: "http://localhost:8079/API/ES/indices",
      beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("token",token);
      },
      success: function (data) {
      },
      error: function (XMLHttpRequest) {
        var str = '<div style="color: red">' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
        if (XMLHttpRequest.status == '500') {
          // alertify.alert(str);
        } else {
          //alertify.alert(str);
        }
      }
    });

    $.when(es).done(function (data) {
      var es_data = JSON.parse(data);
      console.log("es_data data:", es_data);
      var es_grid = [];
      var filename = "";
      var owner = "";
      var length = 0;

      for (var i = 0; i < es_data.length; i++) {
        var data_grid = {};
        if (es_data[i].hasOwnProperty("index") && es_data[i].hasOwnProperty("size")) {
          filename = es_data[i]["index"];
          owner = "ElasticSearch";
          length = es_data[i]["size"];
        }
        data_grid.filename = decodeURI(filename);
        data_grid.owner = owner;
        data_grid.length = length;
        es_grid.push(data_grid);
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
            title: '数据记录（条）',
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
              content += '<button class="btn btn-xs btn-danger"><i class="fa fa-eye">表头信息</i></button>';
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
          gridContainer: 'gridContainer_es',
          toolbarContainer: 'gridToolBarContainer_es',
          pageSize: 10,
          //exportURL:'./../js/dlshouwengrid/app/export.php',
          //tools : 'refresh|print|fastQuery|advanceQuery|export[excel,csv,pdf,txt]',
          tools: 'refresh|print|fastQuery|advanceQuery',
          pageSizeLimit: [5, 10, 15, 20],
          onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
            var filename = record.filename;
            //预览文件
            if (columnNo == 3) {
              $("#EsHeaderModel").modal("toggle");
              var timestamp = new Date().getTime();
              var es_ls_header = $.ajax({
                type: "get",
                url: "http://localhost:8079/API/ES/mapping",
                beforeSend: function (XMLHttpRequest) {
                  XMLHttpRequest.setRequestHeader("index", filename);
                    XMLHttpRequest.setRequestHeader("token",token);

                },
                success: function () {
                },
                error: function (XMLHttpRequest) {
                  var str = '<div style="color: red">' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
                  if (XMLHttpRequest.status == '500') {
                    alertify.alert(str);
                  } else {
                    alertify.alert(str);
                  }
                }
              });
              $.when(es_ls_header).done(function (data) {
                var header_Json = JSON.parse(data);
                console.log("header_Json:", header_Json);
                var datas_grid = [];
                for (var k in header_Json) {
                  var header = header_Json[k];
                }
                for (k in header) {
                  var mapping = header[k];
                }
                for (k in mapping) {
                  var OMS_Station = mapping[k];
                }
                for (k in OMS_Station) {
                  var properties = OMS_Station[k];
                }
                console.log("properties:", properties);
                for (k in properties) {
                  var data_grid = {};
                  data_grid.column = k;
                  data_grid.type = properties[k]["type"];
                  datas_grid.push(data_grid);
                }
                function grid_load(datas) {
                  var gridColumns = [
                    {
                      id: 'column',
                      title: '列',
                      type: 'string',
                      columnClass: 'text-center column',
                      headerStyle: 'background:#00a2ca;color:white;',
                      fastQuery: true,
                      fastQueryType: 'eq'
                    },
                    {
                      id: 'type',
                      title: '类型',
                      type: 'string',
                      columnClass: 'text-center type',
                      headerStyle: 'background:#00a2ca;color:white;',
                      fastQuery: true,
                      fastQueryType: 'eq'
                    }
                  ];
                  var gridOption = {
                    lang: 'zh-cn',
                    ajaxLoad: false,
                    exportFileName: 'zwj',
                    datas: datas,
                    columns: gridColumns,
                    gridContainer: 'gridContainer_EsHeader',
                    toolbarContainer: 'gridToolBarContainer_EsHeader',
                    pageSize: 10,
                    tools: 'refresh|print|fastQuery|advanceQuery',
                    pageSizeLimit: [5, 10, 20, 30, 50, 100],
                    onCellClick: function (value, record, column, grid, dataNo, columnNo, cell, row, extraCell, e) {
                    }
                  };
                  var grid = $.fn.dlshouwen.grid.init(gridOption);
                  grid.load();
                }

                $("#gridContainer_EsHeader").html("");
                grid_load(datas_grid);
              });
            }
          }
        };
        var grid = $.fn.dlshouwen.grid.init(gridOption);
        grid.load();
      }

      $("#gridContainerES").html("");
      grid_load(es_grid);
    });
  }

  es_ls();

//删除文件
  function del(fileName) {
    var timestamp = new Date().getTime();
    var ajax = $.ajax({
      type: "DELETE",
      url: baseUrl + "/API/dfs/remove",
      dataType: 'json',
      beforeSend: function (XMLHttpRequest) {
        XMLHttpRequest.setRequestHeader("Accept", "application/json");
        XMLHttpRequest.setRequestHeader("path", "/" + encodeURI(fileName));
        XMLHttpRequest.setRequestHeader("token", token);
      },
      success: function (data) {
        console.log("rm_data:", data);
        //console.log("fileNames:",record.filename);
      },
      error: function (XMLHttpRequest) {
        var str = '<div style="color: red">删除  ' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
        if (XMLHttpRequest.status == '500') {
          // alertify.alert(str);
        } else {
          //alertify.alert(str);
        }
      }
    });
    return ajax;
  }

  //添加数据源
  $('#add_data').click(function () {
    $('#myModal').modal("toggle");
  });

  //上传数据
  $('#upload').click(function () {
    $('#myModal').modal("hide");
    $('#uploadModel').modal({backdrop: 'static', keyboard: false});
  });

  //公共数据
  $('#public').click(function () {
    $('#myModal').modal("hide");
    $('#publicModel').modal("toggle");
  });


  //还原列表
  $('#reduction').click(function () {
    $('#gridContainer').html("");
    $('#gridToolBarContainer').html("");
    ls();
  });

  //upload_ing的div的显示与隐藏
  $('#upload_ing_head').click(function () {
    var glyphicon = $('#upload_ing_head>i').hasClass('glyphicon-fast-forward');
    //alert(glyphicon);
    if (glyphicon === true) {
      $('.upload_ing').animate({
        right: '-468px'
      });
      $('#upload_ing_head>i').removeClass('glyphicon-fast-forward').addClass('glyphicon-fast-backward');
    } else {
      $('.upload_ing').animate({
        right: '5px'
      });
      $('#upload_ing_head>i').removeClass('glyphicon-fast-backward').addClass('glyphicon-fast-forward');
    }
  });

//上传文件
  //点击upload按钮
  $('#upload_file').click(function () {
    var inputFile = document.getElementById('input_file');
    var fileArry = [];
    var fileNames = [];
    var inputFileLength = inputFile.files.length;
    var upload_status = [];//监听"取消"的点击
    //检测浏览器是否支持fileReader
    if (typeof FileReader == "undefined") {
      alert("您的浏览器不支持FileReader!!(请使用chrome或firefox或是能较好支持html5的浏览器)");
      inputFile.setAttribute("disabled", "disabled");
    }

    //文件上传不准关闭浏览器
    window.onbeforeunload = function (e) {
      window.event.returnValue = "文件正在上传，请勿关闭或刷新页面";
      return "文件正在上传，请勿关闭或刷新页面";
    };

    //未选择文件
    if (inputFile.files.length == 0) {
      alertify.alert("请先选择文件");
    } else {
      $('#uploadModel').modal('hide');
    }

    for (var i = 0; i < inputFileLength; i++) {
      fileArry.push(inputFile.files[i]);
      fileNames.push(inputFile.files[i].name);
      upload_status.push(1);
    }
    $('#upload_ing_body').html(fileNames.map(function (v, k) {
      return '<span>' + (k + 1) + ' : ' + v + '</span> ' + '<div class="progress progress-striped active">' +
        '<div id=' + k + ' class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 0%">' + '<span class=' + k + '>0% 完成</span>' + '</div>' +
        '</div><span style="float: right;color: #00a2ca;cursor: pointer;margin-top:-19px" class="upload_cancel">取消</span><span style="color: #00a2ca;margin-top:-19px;position: absolute" class="upload_time">等待上传</span>';
    }));

    $("#upload_ing_body").on('click', ".upload_cancel", function () {
      //alertify.alert("upload_cancel");
      var width = $(this).prev().children().css("width").replace("px", "");
      var width_parent = $(this).prev().css("width").replace("px", "");
      var id = $(this).prev().children().attr("id");

      if (parseInt(width) < parseInt(width_parent)) {
        $(this).html("<span style='color: red'>已取消</span>");
        $('.progress-striped').eq(id).removeClass('active');
        $(".upload_time").eq(id).html("_:_");
        upload_status[id] = 0;
      }
    });

    //上传文件fileReader
    var step = 1024 * 128;
    var mulitifile = 0;
    mulitiThreading(fileArry);
    function mulitiThreading(Array) {
      var deferred = $.Deferred();
      uploadThread(Array[0], 0, deferred);
      function uploadThread(file, fileId, deferred) {
        uploadFile(file, fileId, deferred);
        deferred.done(function () {
          mulitifile = mulitifile + 1;
          if (mulitifile < inputFileLength) {
            var deferredNext = $.Deferred();
            uploadThread(fileArry[mulitifile], mulitifile, deferredNext);
          } else {
            //alertify.alert("文件全部上传完毕");
            setTimeout(function () {
              $("[data-toggle='tooltip']").tooltip('show');
              setTimeout(function () {
                $("[data-toggle='tooltip']").tooltip('hide');
              }, 10000);
            }, 2000);
            //文件上传完成可以关闭浏览器
            window.onbeforeunload = function (e) {
              return;
            };
          }
        })
      }
    }

    function uploadFile(file, fileId, deferred) {
      //在path下创建空文件filename
      var timestamp = new Date().getTime();
      var uploadOne = $.ajax({
        type: "put",
        url: baseUrl + "/API/dfs/create",
        dataType: 'json',
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader("Accept", "application/json");
          XMLHttpRequest.setRequestHeader("path", "/" + encodeURI(file.name));
          XMLHttpRequest.setRequestHeader("token", token);
          XMLHttpRequest.setRequestHeader("overwrite", "true");
        },
        success: function (data) {
        },
        error: function (XMLHttpRequest) {
          var str = '<div style="color: red">上传文件 create' + XMLHttpRequest.status + ":" + http_state_code[XMLHttpRequest.status] + '</div>';
          if (XMLHttpRequest.status == '500') {
            alertify.alert(str);
          } else {
            alertify.alert(str);
          }
        }
      });
      //创建了文件再填入数据
      $.when(uploadOne).done(function (dataOne) {
          if (upload_status[fileId] === 1) {
            readerFile(file, fileId, deferred);
          } else if (upload_status[fileId] === 0) {
            deferred.resolve();
            del(file.name);
          }
      });
      function readerFile(file, id, deferred) {
        //创建FileReader对象
        var reader = new FileReader();
        //判断后缀
        if (suffix(file.name) == "txt" || suffix(file.name) == "csv" || suffix(file.name) == "TXT" || suffix(file.name) == "CSV" || suffix(file.name) == "json" || suffix(file.name) == "JSON") {
          reader.readAsText(file, 'GBK');
        } else if (suffix(file.name) == "xls" || suffix(file.name) == "xlsx" || suffix(file.name) == "doc" || suffix(file.name) == "docx" || suffix(file.name) == "XLSX" || suffix(file.name) == "XLS") {
          reader.readAsBinaryString(file);
        } else {
          del(file.name);
          //alertify.alert("不支持的文件后缀 ."+suffix(file.name));
          $('.progress-striped').eq(id).removeClass('active');
          $('#' + id.toString()).css({"width": 100 + "%"});
          $('.' + id.toString()).html("<span style='color: red'>不支持的文件后缀</span>");
          deferred.resolve();
        }
        reader.onload = function () {
          var text = this.result;
          //追加数据到文件,onreadystatechange一个执行了5次
          var url = baseUrl + "/API/dfs/append";
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("path", "/" + encodeURI(file.name));
          xhr.setRequestHeader("token", token);
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              loop = 99;
              deferred.resolve();
              $(".upload_time").eq(id).html("剩余时间：0");
            } else if (xhr.status == 404) {
              alertify.alert("404无法找到指定位置的资源");
              del(file.name);
              loop = -1;
              $(".upload_time").eq(id).html("_:_");
            } else if (xhr.readyState == 4 && xhr.status == 413) {
              alertify.alert("上传文件： " + xhr.status + ":" + http_state_code[xhr.status]);
            }
          };
          xhr.send(text);
          var t = id;
          var loop = 0;
          var setinterval = setInterval(function () {
            loop = loop + 1;
            if (loop == 100) {
              $('.progress-striped').eq(t).removeClass('active');
              clearInterval(setinterval);
              ls();
            } else if (loop === -1) {
              $('.progress-striped').eq(t).removeClass('active');
              $('#' + t.toString()).css({"width": 0 + "%"});
              $("#upload_cancel").html("<span style='color: red'>上传失败</span>");
              clearInterval(setinterval);
            }
            $('#' + t.toString()).css({"width": loop.toString() + "%"});
            $('.' + t.toString()).html(loop.toString() + "% 完成");
          }, 500);
          //$("#text").html(text);
        };
      }

      function readerBlob(file, start, i, id, deferred, starTime) {
        //创建FileReader对象
        var reader = new FileReader();
        var blob = file.slice(start, start + step);
        var size_block = parseInt(file.size / step);
        var block = i;//第几块数据
        var t = id;//第几个文件
        //判断后缀
        if (suffix(file.name) == "txt" || suffix(file.name) == "csv" || suffix(file.name) == "TXT" || suffix(file.name) == "CSV" || suffix(file.name) == "json" || suffix(file.name) == "JSON") {
          reader.readAsText(blob, 'GBK');
        } else if (suffix(file.name) == "xls" || suffix(file.name) == "xlsx" || suffix(file.name) == "XLSX" || suffix(file.name) == "XLS" || suffix(file.name) == "doc" || suffix(file.name) == "docx") {
          reader.readAsBinaryString(blob);
        } else {
          del(file.name);
          //alertify.alert("不支持的文件后缀 ."+suffix(file.name));
          $('.progress-striped').eq(id).removeClass('active');
          $('#' + id.toString()).css({"width": 100 + "%"});
          $('.' + id.toString()).html("<span style='color: red'>不支持的文件后缀</span>");
          deferred.resolve();
        }
        reader.onload = function () {
          var text = this.result;
          //追加数据到文件,onreadystatechange一个执行了5次
          var url = baseUrl + "/API/dfs/append";
          var xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("path", "/" + encodeURI(file.name));
          xhr.setRequestHeader("token", token);
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              //调整进度条
              block = block + 1;
              var complete = parseInt(((block * step) / file.size) * 100);
              if (complete >= 100) {
                $('.progress-striped').eq(t).removeClass('active');
                $('#' + t.toString()).css({"width": 100 + "%"});
                $('.' + t.toString()).html(100 + "% 完成");
                ls();
                deferred.resolve();
              } else {
                $('#' + t.toString()).css({"width": complete.toString() + "%"});
                $('.' + t.toString()).html(complete.toString() + "% 完成");
              }
              //剩余时间计算
              var endTime = new Date().getTime();
              var takeTime = endTime - starTime;
              var needTime = takeTime * (size_block - block + 1);
              needTime = remainingTime(needTime);
              $(".upload_time").eq(id).html("剩余时间：" + needTime);
              //循环追加数据
              if (block <= size_block && upload_status[id] === 1) {
                readerBlob(file, start + step, block, id, deferred, endTime);
              } else if (upload_status[id] === 0) {
                $(".upload_time").eq(id).html("_:_");
                deferred.resolve();
              }
            } else if (xhr.status == 404) {
              alertify.alert("404无法找到指定位置的资源");
              del(file.name);
              $('.progress-striped').eq(id).removeClass('active');
              $('#' + t.toString()).css({"width": 0 + "%"});
              $("#upload_cancel").html("<span style='color: red'>上传失败</span>");
            }
          };
          xhr.send(text);

        };
      }
    }

    //弹出上传文件列表框
    $('.upload_ing').animate({
      right: '5px'
    });
    $('#upload_ing_head>i').removeClass('glyphicon-fast-backward').addClass('glyphicon-fast-forward');
  });

});
