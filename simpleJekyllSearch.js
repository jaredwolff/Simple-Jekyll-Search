(function($) {
    $.fn.simpleJekyllSearch = function(options) {
        var settings = $.extend({
            jsonFile        : '/search.json',
            jsonFormat      : 'title,category,desc,url,date',
            template        : '<a href="{url}" title="{title}">{title}</a>',
            searchResults   : '.results',
            searchResultsTitle   : '<h4>Search results</h4>',
            limit           : '10',
            noResults       : '<p>Oh shucks<br/><small>Nothing found :(</small></p>'
            unorderedList       : true,
        }, options);

        var properties = settings.jsonFormat.split(',');
        
        var jsonData = [],
            origThis = this,
            searchResults = $(settings.searchResults);

        if(settings.jsonFile.length && searchResults.length){
            $.ajax({
                type: "GET",
                url: settings.jsonFile,
                dataType: 'json',
                success: function(data, textStatus, jqXHR) {
                    jsonData = data;
                    registerEvent();
                },
                error: function(x,y,z) {
                    console.log("***ERROR in simpleJekyllSearch.js***");
                    console.log(x);
                    console.log(y);
                    console.log(z);
                    // x.responseText should have what's wrong
                }
            });
        }


        function registerEvent(){
            origThis.keyup(function(e){
                if($(this).val().length){
                    writeMatches( performSearch($(this).val()) );
                }else{
                    clearSearchResults();
                }
            });
        }

        function performSearch(str){
            var matches = [];

            $.each(jsonData,function(i,entry){
                for(var i=0;i<properties.length;i++)
                    if(entry[properties[i]] !== undefined && entry[properties[i]].toLowerCase().indexOf(str.toLowerCase()) > 1){
                        matches.push(entry);
                        i=properties.length;
                    }
            });
            return matches;

        }

        function writeMatches(m){
            clearSearchResults();
            // Adding <ul> tags for unordered list variable
            if (settings.unorderedList) {
                searchResults.append( $(settings.searchResultsTitle + "<ul>") );
            } else {
                searchResults.append( $(settings.searchResultsTitle) );
            }

            if(m.length){
                $.each(m,function(i,entry){
                    if(i<settings.limit){
                        var output=settings.template;
                        for(var i=0;i<properties.length;i++){
                            var regex = new RegExp("\{" + properties[i] + "\}", 'g');
                            output = output.replace(regex, entry[properties[i]]);
                        }

                        // Adding <li> tags for unordered list variable
                        if(settings.unorderedList) {
                            searchResults.append( $("<li>" + output + "</li>"));
                        } else {
                            searchResults.append($(output));
                        }
                    }
                });
            }else{
                searchResults.append( settings.noResults );
            }

            // Adding <ul> tags for unordered list variable
            if (settings.unorderedList) {
                searchResults.append( "</ul><div class='text-right post-close-text'><a class='clear-search' href='#'>Close Search</a></div><hr>" );

                jQuery(document).ready( function( ) { registerCloseClick(); } );
            }

        }

        function clearSearchResults(){
            unregisterCloseClick();
            searchResults.children().remove();
            content.show();
        }
    }
}(jQuery));
