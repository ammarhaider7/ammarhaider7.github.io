/*
Economic activity by religion by sex by age
Employment types (c_ecopuk11):-
0. Total (Value = 0)
1. In employment: Total (Value = 2)
2. Self-employed: Total (Value = 6)
4. Unemployed (excluding Full-time students): Total (Value = 11)
5. Retired (Value = 14)
6. Looking after home or family (Value = 16)
7. Long-term sick or disabled (Value = 17)
8. Other (Value = 18)
9. Student (including full-time students) (Value = 15)
*/

function runAjax(sex) {
    
    $.ajax({
        url: "https://www.nomisweb.co.uk/api/v01/dataset/NM_681_1.data.json?date=latest&c_age=0&c_sex=" + sex + "&geography=K04000001&c_relpuk11=5",
        success: pieSuccess,
        error: function() {
                    console.log("This one failed")
                }
    });
}

$(function() {
    runAjax(0);
});

function percent(n,total){
   return Math.round(n / total * 100);
}

var gender;

$('.sex_selector input').click(function() {
    if($(this).val() === 'Males') {
        gender = 1; 
    } else if($(this).val() === 'Females') {
        gender = 2;
    } else if($(this).val() === 'All') {
        gender = 0;
    }
    runAjax(gender);
});

var pieSuccess = function(data) {
    			    var nodes = data.obs;
                    var types = {
                        total: nodes[0].obs_value.value, 
                        inEmp: nodes[3].obs_value.value,
                        selfEmp: nodes[6].obs_value.value,                        
                        unEmp: nodes[11].obs_value.value,                        
                        retired: nodes[14].obs_value.value,                        
                        lHoF: nodes[16].obs_value.value,                        
                        sick: nodes[17].obs_value.value,                        
                        other: nodes[18].obs_value.value,                        
                        student: nodes[15].obs_value.value                       
                    }
                    //Highcharts pie chart initiate
                    $(function () {
                        // Build the chart
                        $('#pie_container').highcharts({
                            chart: {
                                plotBackgroundColor: null,
                                plotBorderWidth: null,
                                plotShadow: false
                            },
                            title: {
                                text: 'Economic activity of Muslims, England & Wales, 2011'
                            },
                            tooltip: {
                                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                            },
                            plotOptions: {
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: true,
                                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                        style: {
                                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                        }
                                    }
                                }
                            },
                            series: [{
                                type: 'pie',
                                name: 'Economic Activity',
                                data: [
                                    ['In Employment',   percent(types.inEmp,types.total)],
                                    ['Self-employed',       percent(types.selfEmp,types.total)],
                                    ['Unemployed',   percent(types.unEmp,types.total)],
                                    ['Retired',    percent(types.retired,types.total)],
                                    ['With Home/Family',     percent(types.lHoF,types.total)],
                                    ['Sick/disabled',   percent(types.sick,types.total)],
                                    ['Other',   percent(types.other,types.total)],
                                    ['Student',   percent(types.student,types.total)]
                                ]
                            }]
                        });
                    });
    			 }
