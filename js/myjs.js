$(function() {
	// modal
	$(".modal").modal({
		show:false,
		backdrop:false
	});
	//栏目管理获取数据
	function getLmgl(){
		$.get("http://120.78.164.247:8099/manager/category/findAllCategory",function(result){
			var arr = result.data;
			$(".lmgl table tbody").empty();
			// 初始选择框
			$(".pos select").empty();
			$(".pos2 select").empty();
			$(".pos select").append("<option value=''>---请选择---</option>");
			$(".pos2 select").append("<option value=''>---请选择---</option>");
			arr.forEach(function(item,index) {
				if(!item.parent){
					var o = {};
					o.name = "无";
				}else{
					var o = {};
					o.name = item.parent.name;
				}
				$(".lmgl table tbody").append("<tr><td><input type='checkBox'></td><td>"+item.name+"</td><td>"+o.name+"</td><td>"+item.comment+"</td><td><i class='iconfont icon-xiugai'></i><i class='iconfont icon-shanchu'></i></td></tr>");
				$(".lmgl .table tbody tr td input").eq(index).val(item.id);
				$(".pos select").append("<option value='"+item.id+"'>"+item.name+"</option>");
				$(".pos2 select").append("<option value='"+item.id+"'>"+item.name+"</option>");
			});
			rm_single_column();
			upLmgl();
			// console.log(result);
		});
	};
	$(".left_main_container ul li a").click(function() {
		var index = $(".left_main_container ul li a").index(this);
		$(".right_main_container").addClass("showIt");
		$(".right_main_container").eq(index).removeClass("showIt");
		if (index == 1) {
			//栏目管理获取数据
			getLmgl();
		}else if(index==2) {
			// 资讯管理获取数据
			getZxgl();
		}else if(index==3) {
			// 获取用户数据
			getYhgl();
		}
	});
	//新增栏目
	$(".addColumn").click(function() {
		var o = {};
		o.id = $(".pos input:first").val();
		o.name = $(".pos input:not(:first)").val();
		o.comment = $(".pos textarea").val();
		o.no = 232;
		o.parentId = $(".pos select").val();
		if(o.name&&o.comment){
			$.post("http://120.78.164.247:8099/manager/category/saveOrUpdateCategory",o,function(result){
				// console.log(result);
				getLmgl();
			});
			o.name = $(".pos").find("input:not(:first)").val(null);
			o.comment = $(".pos").find("textarea").val(null);
			o.parentId = $(".pos").find("select").val(null);
		}else{
			alert("请填写有效信息");
		}
	});
	// 栏目修改
	function upLmgl() {
		$(".newAdd").click(function() {
			$(".pos input:first").hide();
			$(".pos input:first").val(null);
		});
		var $i = $(".lmgl>table>tbody>tr i:even");
		$i.click(function() {
			$("#myModal").modal();
			$(".pos input:first").show();
			var id = $(this).parent().siblings(":first").children().val();
			$(".pos input:first").val(id);
		});
	}
	//栏目批量删除
	$(".rm_some_column").click(function() {
		var arr=[];
		$(".lmgl .table tbody tr td input:checked").each(function(index,item){
			 arr.push($(item).val());
		});
		var o = {
			ids:arr.toString()
		}
		$.post("http://120.78.164.247:8099/manager/category/batchDeleteCategory",o,function(result) {
			// console.log(result);
			getLmgl();
		});
	});
	//栏目删除
	function rm_single_column() {
		var $i = $(".lmgl>table>tbody>tr i:odd");
		$i.click(function() {
			var id = "id="+$(this).parent().siblings(":first").children().val();
			$.get("http://120.78.164.247:8099/manager/category/deleteCategoryById",id,function() {
				getLmgl();
			});
		});
	}
	//资讯管理获取数据
	function getZxgl() {
		var mark = 0;
		var o = {
			page:7,
			pageSize:20
		};
		getRe();
		$("button.chaxun").click(function() {
			o.page=$("input.page").val();
			o.pageSize=$("input.pageSize").val();
			getRe();
		});
		function getRe() {
			$("input.page").val(o.page);
			// $("input.pageSize").val(o.pageSize);
			$.get("http://120.78.164.247:8099/manager/article/findArticle",o,function(result) {
				var arr = result.data.list;
				$(".zxgl table tbody").empty();
				arr.forEach(function(item,index) {
					if(!item.category) {
						var o = {};
						o.name = "无";
					}else{
						var o = {};
						o.name = item.category.name;
					}
					$(".zxgl table tbody").append("<tr><td><input type='checkBox'></td><td>"+item.title+"</td><td>"+o.name+"</td><td>"+item.music+"</td><td></td><td>"+item.publishtime+"</td><td>"+item.readtimes+"</td><td><i class='iconfont icon-xiugai'></i><i class='iconfont icon-shanchu'></i></td></tr>");
					$(".zxgl table tbody tr td input").eq(index).val(item.id);
					getLmgl();
				});
				// console.log(result);
				rm_zxgl_single();
				upZxgl();
			});
		}
	}
//添加文章

	// 选择文章样式
	$("div.sty").click(function() {
		$(this).addClass("cheacked").siblings("div[class^='sty']").removeClass("cheacked");
	});
	// 获取输入数据并添加
	$("button.publish").click(function() {
		var o ={};
		o.id = $(".pos2 input:first").val();
		o.title = $(".pos2 input:not(:first)").val();
		o.liststyle = $("div.cheacked").attr("name");
		o.music = "Error";
		o.categoryId = $(".pos2 select").val();
		o.content = $(".pos2 textarea").val();
		if(o.id){
			var date = new Date();
			var year = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			var time = year+"-"+m+"-"+d;
			o.publishtime = time;
			o.readtimes = "7";
		}
		if(o.title&&o.liststyle) {
			$.post("http://120.78.164.247:8099/manager/article/saveOrUpdateArticle",o,function(result) {
				$(".pos2 input:not(:first)").val("");
				var content = $(".pos2 textarea").val("");
				var categoryId = $(".pos2 select").val("");
				getZxgl();
			});
		}
	});
	//资讯批量删除
	$(".rm_zxgl_some").click(function() {
		var ids = [];
		$(".zxgl table tbody tr td input:checked").each(function(index,item){
			ids.push($(item).val());
			// console.log($(item).val());
		});
		var o ={
			ids:ids.toString()
		}
		$.post("http://120.78.164.247:8099/manager/article/batchDeleteArticle",o,function(result) {
			getZxgl();
		});
	})
	// 资讯单个删除
	function rm_zxgl_single() {
		$(".zxgl table tbody tr td i:odd").click(function() {
			var id = $(this).parent().siblings(":first").children().val();
			var o = {
				id:id
			};
			$.get("http://120.78.164.247:8099/manager/article/deleteArticleById",o,function(){
				getZxgl();
			});
		});
	}
	// 资讯修改
	function upZxgl() {
		$(".addZxgl").click(function() {
			$(".pos2 input:first").hide();
			$(".pos2 input:first").val(null);
		});
		$(".zxgl table tbody tr td i:even").click(function() {
			$(".pos2 input:first").show();
			$("#my2modal").modal();
			var id = $(this).parent().siblings(":first").children().val();
			$(".pos2 input:first").val(id);
		});
	}
	//用户管理状态按钮
	function anniu(){
		$(".open_close").click(function() {
			$(this).toggleClass("changeColor");
			$(this).children(".cicrl").css({"transition":"all .3s"});
			$(this).children(".cicrl").toggleClass("move_d");
			$(this).children(".tip_open").toggle();
			$(this).children(".tip_close").toggle();
		});
	}
	//用户管理信息获取
	function getYhgl(){
		$.get("http://120.78.164.247:8099/manager/user/findAllUser",function(result) {
			var arr = result.data;
			$(".yhgl ul").empty();
			arr.forEach(function(item,index) {
				var id = item.id;
				if(item.enabled){
					$(".yhgl ul").append("<li name='"+id+"'><div><span title='删除用户'>X</span><img src='"+item.userface+"' alt='无头像'><table class='user_info'><tbody><tr><td>用户名</td><td>"+item.nickname+"</td><tr><tr><td>真实姓名</td><td>"+item.username+"</td></tr><tr><td>手机号</td><td>XXXXXXXXXXX</td></tr><tr><td>email</td><td>"+item.email+"</td></tr><tr><td>状态</td><td><span class='open_close changeColor'><span class='cicrl'></span><span class='tip_open showde'>开启</span><span class='tip_close hided'>关闭</span></span></td></tr></tbody></div></li>");
				}else{
					$(".yhgl ul").append("<li name='"+id+"'><div><span title='删除用户'>X</span><img src='"+item.userface+"' alt='无头像'><table class='user_info'><tbody><tr><td>用户名</td><td>"+item.nickname+"</td><tr><tr><td>真实姓名</td><td>"+item.username+"</td></tr><tr><td>手机号</td><td>XXXXXXXXXXX</td></tr><tr><td>email</td><td>"+item.email+"</td></tr><tr><td>状态</td><td><span class='open_close'><span class='cicrl move_d'></span><span class='tip_open'>开启</span><span class='tip_close'>关闭</span></span></td></tr></tbody></div></li>");
				}
			});
			delUser();
			anniu();
		});
	}
	// 添加用户
	$("button.addUser").click(function() {
		var o = {};
		o.username = $(".pos3 input").eq(0).val();
		o.password = $(".pos3 input").eq(1).val();
		o.nickname = $(".pos3 input").eq(2).val();
		o.email = $(".pos3 input").eq(3).val();
		o.userface = $(".pos3 input").eq(4).val();
		// console.log(o.username,o.password,o.nickname,o.email,o.userface);
		if(o.username&&o.password&&o.nickname&&o.email) {
			$.post("http://120.78.164.247:8099/manager/user/saveOrUpdateUser",o,function() {
				getYhgl();
				o.username = $(".pos3 input").eq(0).val(null);
				o.password = $(".pos3 input").eq(1).val(null);
				o.nickname = $(".pos3 input").eq(2).val(null);
				o.email = $(".pos3 input").eq(3).val(null);
				o.userface = $(".pos3 input").eq(4).val(null);
			});
		}
	});
	// 删除用户
	function delUser() {
		// console.log($(".yhgl ul li>div>span"));
		$(".yhgl ul li>div>span").click(function() {
			var id = $(this).parent().parent().attr("name");
			// console.log(id);
			var o = {
				id:id
			}
			var val = confirm("是否删除该用户");
			if(val){
				$.get("http://120.78.164.247:8099/manager/user/deleteUserById",o,function() {
					getYhgl();
				});
			}
		});
	}
});