(function(){
	var _LP = 100,
		ITERATION = 50,
		STEP_DISCOUNT = 10;
	var	league = {
		def: function(){
		    var obj = [
					{key: 1, value: 'V'},
					{key: 2, value: 'IV'},
					{key: 3, value: 'III'},
					{key: 4, value: 'II'},
					{key: 5, value: 'I'}
		    ];
		    return obj;
		},
		Bronze: function() {return {price: 10, value: this.def()}},
		Silver: function() {return {price: 15, value: this.def()}},
		Gold:   function() {return {price: 20, value: this.def()}},
		Platinum:  function() {return {price: 30, value: this.def()}},	
		Diamond:  function() {return {price: 40, value: this.def()}},
		Master:  function() {return {price: 50, value: null}},
		Challenger:  function() {return {price: 70, value: null}}
	};

	var leagueAll = [],
		keys = Object.keys(league).slice(1);
	keys.forEach(function(elName, i){
		if(league[elName]().value != null)
		{
			league[elName]().value.forEach(function(elValue, j){
			leagueAll.push({ name: elName, 
						     key: league[elName]().value[j], 
						     price: league[elName]().price,
						     iter: (j+1)*(i+1)     
						 });
			});
		}
		else
			leagueAll.push({ name: elName, 
						     key: null, 
						     price: league[elName]().price,
						     iter: leagueAll[leagueAll.length - 1].iter     
						 });		
	});

	var _app = {
		init: function(){
			var tagLeague = $(".league");	
			var funcLeague = function(tag, tagIndex){
				tag = $(tag);
				var menuLeague = tag.find(".menu");
				var enumLeague = Object.keys(league).slice(1);
				if(tagIndex == 0)
					enumLeague.pop();
				enumLeague.forEach(function(el, i){
					var leagueKey = "<div class='item' data-value="+i+">"+el+"</div>";
					menuLeague.append(leagueKey);					
				});
			}		

			Array.prototype.forEach.call(tagLeague, funcLeague);
			
			tagLeague.on("change", function(e){
				var check = ($(this).hasClass("left") ? true : false);
				var direction = function(bool){
					return (bool) ? "left" : "right"
				};			
				var tagLeagueVal = +($(this)).find("input").val(),			
					leagueKeys = Object.keys(league).slice(1),
					tagInverce = $($(".league." + direction(!check))),
					tagInverceLeagueVal = +tagInverce.find("input").val();	

				var equal = function(val1, val2)
				{
					if(val1 === val2)
						return true;
					return false; 
				}				
				//if((tagLeagueVal > tagInverceLeagueVal && check) || tagLeagueVal < tagInverceLeagueVal && !check) 
				if(check)
				{
					tagInverce.find(".menu").children().remove();
					newLeagueKeys = leagueKeys.slice(tagLeagueVal);
									
					if(leagueKeys[tagLeagueVal] == "Master")
					{		
						tagInverceLeagueVal = tagLeagueVal + 1;
						newLeagueKeys = newLeagueKeys.slice(1);
					}

					tagInverce.find("input")[0].value = 0;
					newLeagueKeys.forEach(function(el, i){
						var leagueKey = "<div class='item' data-value="+i+">"+el+"</div>";
						tagInverce.find(".menu").append(leagueKey);					
					});

					tagInverce.dropdown();
					tagInverceLeagueVal = tagLeagueVal;
					_app.redrawDivision(direction(!check), tagInverceLeagueVal ,equal(tagLeagueVal, tagInverceLeagueVal));
					$(".division." + direction(check)).find("input")[0].value = 0;
				}
				else if(equal(tagLeagueVal, tagInverceLeagueVal) && leagueKeys[tagLeagueVal] == "Master")
				{
					var tag = $(".league.right");
					tag.find("input")[0].value = tagLeagueVal + 1;
					tag.dropdown();
				}
				
				_app.redrawDivision(direction(check), tagLeagueVal, equal(tagLeagueVal, tagInverceLeagueVal));			
				_app.calculate();				
			})

			var tagDivision = $(".division");

			var funcDivision = function(tag, tagIndex){
				var leagueDefVal = +tagLeague.find("input").val();
				var enumLeague = Object.keys(league).slice(1);
				tag = $(tag);
				var menuDivision = tag.find(".menu");
				var value = league[enumLeague[leagueDefVal]]().value;
				if(value != null)
					{
						if(tagIndex == 1 && enumLeague[leagueDefVal] == "Bronze")
							value.shift();
						value.forEach(function(el, i){								
							var DivisionKey = "<div class='item' data-value="+i+">"+el.value+"</div>";
							menuDivision.append(DivisionKey);
						});
					}
			}

			Array.prototype.forEach.call(tagDivision, funcDivision);
			tagDivision.on("change", function(){
				var check = ($(this).hasClass("left") ? true : false),
					direction = function(bool){
					return (bool) ? "left" : "right"
				};	

				var tagLeagueVal = +$(".league." + direction(check)).find("input").val(),
					tagInverceLeagueVal = +$(".league." + direction(!check)).find("input").val(),
					selectedLeagueVal = $(".league." + direction(check)).find(".selected").text(),
					selectedInverceLeagueVal = $(".league." + direction(!check)).find(".selected").text();

				var tagDivisionVal = +($(this)).find("input").val();
				
				if(check && selectedLeagueVal == selectedInverceLeagueVal)
				{		
					var leagueKeys = Object.keys(league).slice(1);
					var value = league[leagueKeys[tagLeagueVal]]().value;

					if (value != null && value.length > tagDivisionVal + 1)
						_app.redrawDivision(direction(!check), tagInverceLeagueVal  ,false,  tagDivisionVal + 1)
					else if(value != null && value.length === tagDivisionVal + 1)
					{
						$(".league." + direction(!check)).find("input")[0].value = tagInverceLeagueVal + 1;
						$(".league." + direction(!check)).dropdown();
						_app.redrawDivision(direction(!check), tagInverceLeagueVal, false);				
					}
				}
				_app.calculate();
			})

			var lp = $(".lp");
				lp.on("input", function(e){
					var val = +$(this).val(); 
					if (val > 100)
						val = 100
					else if(val < 0)
						val = 0
					_app.calculate();
				})
		},
		redrawDivision: function(direction, tagValueParent, IsEqual, sliceEl = 0){
			var tagDivision = $(".division." + direction);
					tagDivision.find(".text").text("");
				var divisionMenu = tagDivision.children().last();
					divisionMenu.children().remove();
				var leagueKeys = Object.keys(league).slice(1);


				var division = league[leagueKeys[tagValueParent]]().value;
				if(division != null)
					{
						if(direction == "right" && IsEqual)
							division.shift();
						division = division.slice(sliceEl);
						division.forEach(function(el, i){								
							var DivisionKey = "<div class='item' data-value="+i+">"+el.value+"</div>";
							divisionMenu.append(DivisionKey);
						});
					}
				tagDivision.dropdown();
		},
		checkValid: function(tag){
			if(tag.hasClass('left')){
				var param = tag.find("selected").text();
			}
			else return true;
		},
		calculate: function(){
			var leagInp = +$('.league.left').find('input').val(),
				divInp = +$('.division.left').find('input').val(),
				leagOut = +$('.league.right').find('input').val(),
				divOut = +$('.division.right').find('input').val();

			
			
			//var leagueKeys = Object.keys(league).slice(1);
			leagInp = $('.league.left').find("[data-value="+ leagInp +"]")[0].innerHTML;
			leagOut = $('.league.right').find("[data-value="+ leagOut +"]")[0].innerHTML;
			//leagOut = leagueKeys[leagOut];

			divInp = $('.division.left').find("[data-value="+ divInp +"]").text();
			divOut = $('.division.right').find("[data-value="+ divOut +"]").text();

			var sum = 0,
				stIndex = 0,
				endIndex = 0;
			for(var i = 0, n = leagueAll.length; i < n; i++)
			{
				if((leagueAll[i].name == leagInp) && ((leagueAll[i].key != null) && (leagueAll[i].key.value == divInp) || (divInp === "")))  
					stIndex = i;

				if((leagueAll[i].name == leagOut) && ((leagueAll[i].key != null) && (leagueAll[i].key.value == divOut) || (divOut === "")))
					endIndex = i;
			}

			var lp = $(".lp").val() || 0;
			var koef = Math.round((lp / (_LP/ITERATION))/10);

			for(var i = stIndex; i < endIndex; i++)
			{
				//fix it for first step (lp discount)
				sum += leagueAll[i].price;
				if(i === stIndex)
					sum = sum - sum*(STEP_DISCOUNT/100 * koef);
			}
			$(".calculate").text("summa = " + sum);
		}
	}
	_app.init();
	_app.calculate();
	$(".dropdown").dropdown();

})();