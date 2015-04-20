//Ethnicity by Religion

(function() {
    
    //var for holding region buttons html
    var regionsHTML = '';
    
    //Declare function that will gather the regions and add to an array
    var regionsFunc = function(data) {
        //Get the region nodes from the ajax response
        var nodes = data.structure.codelists.codelist[0].code;
        //Loop through region nodes and log description value
        $(nodes).each(function(i) {
            var regionCode = ($(this)[0].value);
            var regionNames = ($(this)[0].description.value);
            //console.log(regionCode + ": " + regionNames);
            regionsHTML += '<input type="button" value="' + regionNames + '" code="' + regionCode + '"><br>';
        });
        // Display the area selections in the "mylist" div
        document.getElementById('mylist').innerHTML = regionsHTML;
        $('#mylist input').click(function() {
            var regionCode = $(this).attr('code');
            var regionName = $(this).attr('value');
            getdata(regionCode,regionName);
        });
        
    }
    var regionsErr = function(e) {
        //error handling
    }
    
    //Make first API call to get the regions
    $.ajax({
        url: "http://www.nomisweb.co.uk/api/v01/dataset/nm_1_1/geography/2092957697TYPE480.def.sdmx.json",
        dataType: 'json',
        success: regionsFunc,
        error: regionsErr
    });
    
    function getdata(regionCode,regionName) {
        document.getElementById('mydata').innerHTML = '<span style="color: #0000a0;">Please wait - fetching data for ' + regionName + '...</span>';
        //Declare success func for Ethnicity AJAX call
        var ethnicFunc = function(data) {
            //Create array to store the values
            var valArr = [];
            //Decalre a total value which can be added to later
            var Total = 0;
            // String to hold the html table of results
            var mytable = '<table><tr><th colspan="5">' + regionName + '</th></tr><tr><th align="left">Date</th><th align="left">Religion</th><th align="left">Ethnicity</th><th align="left">No. people</th><th>%</th></tr>';
            //Gives nodes var access to json response
            var nodes = data.obs;
            //Loop through region nodes and collect values
            $(nodes).each(function(i) {
                //Store values
                var Value = nodes[i].obs_value.value,
                    Religion = nodes[i].c_relpuk11.description,
                    ethnicityStr = nodes[i].c_ethpuk11.description,
                    Ethnicity = ethnicityStr.substr( 0, ethnicityStr.length - 7 ),
                    Date = nodes[i].time.description;
                
                //Construct table
                mytable += '<tr><td nowrap>' + Date + '<td>' + Religion + '</td></td><td align="left">' + Ethnicity +
                '</td><td class="Value">' + Value +
                '</td><td class="Percent">' + '...' +
                '</td></tr>';
                
                //Push each iterated value into valArr
                valArr.push(Value);
                
            });
            
            //Sum valArr values
            $.each(valArr, function() {
                //Assign to Total
                Total += this;
            });
                        
            // Finish off the table
            mytable += '</table>';

            // Display the results table in the "mydata" div
            document.getElementById('mydata').innerHTML = mytable;
            
            
            //Loop through Values and create percentages
            $('.Value').each(function() { 
                var num = parseInt($(this).text()),
                    percent = num / Total * 100,
                    round = Math.round(percent);
                
                //Display percent
                $(this).next().text(round + "%");
            });
        
        }

        var ethnicErr;

        //Make ajax call to get ethnicity of muslims by region...
        $.ajax({
            url: "https://www.nomisweb.co.uk/api/v01/dataset/NM_659_1.data.json?date=latest&geography=" + regionCode + " &c_ethpuk11=1,6,11,17,21&c_relpuk11=5&measures=20100",
            success: ethnicFunc,
            error: ethnicErr
        });
        
        
    }
    
})();
