/**
 * Created  on 2016/10/8.
 */
$(function(){
    //登陆
    var cookie = sessionStorage.getItem('token');

        //登陆
    $('#member,#header_logout').hide();
    if(cookie){
        $('#member,#header_logout').show();
        $('#header_login').hide();
        $('#member').html("欢迎: "+cps+" | ");
    }else{
        $('#member,#header_logout').hide();
        $('#header_login').show();
    }
    $('#header_logout').click(function(){
        //退出登录
        localStorage.removeItem('token');
        window.location.href='./login.html';
    });

    //判断是否登录
    if(cookie){
    }else{
        alertify.confirm('请先登录',function(e){
            if(e){
            }
            location.href="./login.html";
        });
    }

    //content
    $('.content').click(function(){
        $('.content').removeClass('current');
        $(this).addClass('current');
    });

    //dataSource
    $('#dataSource').click(function(){
        window.location.href = 'dataSource.html';
        //$('#iframe').attr('src','taskSpace/iframe_dataSource.html');
    });

    //machineLearning
    $('#machineLearning').click(function(){
        window.location.href = 'machineLearning.html';
        //$('#iframe').attr('src','taskSpace/iframe_machineLearning.html');
    });

    //myHistory
    $('#myHistory').click(function(){
        window.location.href = 'myHistory.html';
        //$('#iframe').attr('src','taskSpace/iframe_myHistory.html');
    });

    //myHistory
    $('#report').click(function(){
        window.location.href = 'report.html';
        //$('#iframe').attr('src','taskSpace/iframe_report.html');
    });

});
