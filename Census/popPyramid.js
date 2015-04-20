//Population pyramid for Muslims in England & Wales

//DOM ready init
$(function() {
    //Run initial Ajax call
    popPyr.runAjax(5,"Muslims");
    //Handle clicks on religion buttons
    $('#religions input').click(function() {
        var religionName = $(this).val();
        var religionCode = $(this).attr('code');
        Math.round(1000*popPyr.findMax())/1000;
        popPyr.runAjax(religionCode,religionName);
    });
});

var popPyr = {
    findMax: function() {
                var valArr = [];
                $.each(popPyr.nodes, function() {
                    valArr.push(this.obs_value.value);
                    });
                var n = Math.max.apply(Math,valArr);
                return Math.ceil(n/10000)*10000;
            },
    //Format age string helper
    formatAge: function(age) {
                age = age.substr(4,age.length).replace(/ to /,"-");
                return age;
                },
    //Retrieve the raw age strings from the nodes
    getAges: function() {
                var agesArr = [];
                //Separate function to avoid scope issues
                function agesArrPush(item) {
                    agesArr.push(item);
                }
                for(i=0; i<21; i++) {
                    agesArrPush(popPyr.nodes[i].c_age.description);
                }
                return agesArr;
            },    
    //Get json data nodes via ajax
    runAjax: function(religionCode,religionName) {
                $.ajax({
                    url: "https://www.nomisweb.co.uk/api/v01/dataset/NM_657_1.data.json?date=latest&c_age=1...21&c_sex=1,2&geography=K04000001&c_relpuk11=" + religionCode + "",
                    success: function(data) {
                                //Pass response data elements into popPyr.nodes
                                popPyr.nodes = data.obs;
                                //Build pyramid
                                popPyr.buildPyramid(religionName);
                            },
                    error: function(data) {
                                console.log("This one failed")
                            }
                });
            },
    males: function() {
                var malesArr = [];
                for(i = 0; i<21; i++) {
                    malesArr.push(-Math.abs(popPyr.nodes[i].obs_value.value));
                }
                return malesArr;
            },
    females: function() {
                var femalesArr = [];
                for(i = 21; i<42; i++) {
                    femalesArr.push(popPyr.nodes[i].obs_value.value);
                }
                return femalesArr;
            },
    hcCategories: function() {
                    //Create second array
                    var fAgesArr = [];
                    //Loop through raw ages array and format ages
                    for(var i = 0; i < popPyr.getAges().length; i++) {
                        //Pass formatted ages into second array
                        fAgesArr.push(popPyr.formatAge(popPyr.getAges()[i]));
                    }
                    //Return second array
                    return fAgesArr;  
                },
    buildPyramid: function(religionName) {
        
                    $(function () {
                        
                        var categories = popPyr.hcCategories();
                        
                        $(document).ready(function () {
                            $('#pyramid_container').highcharts({
                                chart: {
                                    type: 'bar'
                                },
                                title: {
                                    text: 'Population pyramid for ' + religionName + ', England & Wales'
                                },
                                subtitle: {
                                    text: 'Source: www.census.gov'
                                },
                                xAxis: [{
                                    categories: categories,
                                    reversed: false,
                                    labels: {
                                        step: 1
                                    }
                                }, { // mirror axis on right side
                                    opposite: true,
                                    reversed: false,
                                    categories: categories,
                                    linkedTo: 0,
                                    labels: {
                                        step: 1
                                    }
                                }],
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        formatter: function () {
                                            return (Math.abs(this.value) / 1000000) + 'm';
                                        }
                                    },
                                    min: -popPyr.findMax(),
                                    max: popPyr.findMax()
                                },

                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                },

                                tooltip: {
                                    formatter: function () {
                                        return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                                            'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                                    }
                                },

                                series: [{
                                    name: 'Male',
                                    data: popPyr.males()
                                }, {
                                    name: 'Female',
                                    data: popPyr.females()
                                    }]
                                });
                            });
                        });
                    }
}
