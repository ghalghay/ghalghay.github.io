﻿/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
VirtualScrolling:
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/VirtualScrolling/Knockout/Light/
Если компонент DataGrid привязан к большому набору данных, вы можете включить функцию виртуальной прокрутки, чтобы оптимизировать время загрузки данных и улучшить навигацию пользователя. Компонент вычисляет общее количество видимых строк и отображает полосу прокрутки, которая позволяет пользователям переходить к любому разделу строк. Когда пользователи отпускают ползунок прокрутки, элемент управления загружает записи для отображения в области просмотра и удаляет другие строки из памяти:
    dataSource: allData, //после dataSource: allData
            scrolling: {
                mode: "virtual"
            },          
            sorting: {		//без "none sorting"
                mode: "none"
            },
            onContentReady: function(e) {
                e.component.option("loadPanel.enabled", false);
            }


https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/InfiniteScrolling/jQuery/Light/
ВАРИАНТ с подгрузкой по мере прокрутки:
    dataSource: allData, //после dataSource: allData
        loadPanel: {
            enabled: false
        },
        scrolling: {
            mode: 'infinite'
        },
        sorting: {
            mode: "none"
        }


$(function(){
...
});
*/





//ə
//äꜧǎăâāčšžöņæ
//íúń — акут над этими убирается 

//̈
//Комбинируемое надстрочное двоеточие 0308
//̀
//Комбинируемый гравис (тяжёлое ударение) 0300
//́
//Комбинируемый акут (лёгкое ударение) 0301
//í
//Латинская строчная буква i с акутом 00ED
//Ꜧ
//Латинская заглавная буква heng A726
//ꜧ
//Латинская строчная буква heng A727
//̂
//Комбинируемый циркумфлекс (облечённое ударение) 0302
//̌
//Комбинируемая птичка над буквой 030C
//̄
//Комбинируемый макрон 0304
//̅
//Комбинируемое надчёркивание 0305
//̆
//Комбинируемое бреве (бревис, кратка) 0306


//var prevValue,prevPattern; //Alex_Piggy add  Для ускорения (раза в два). Смысл в том, чтобы он выражение поиска считал один раз за изменение, а не для каждой строки отдельно


//регистронезавис .replace(/.../gi,

//REGEX
function gCalculateFilterExpression (value, selectedFilterOperations, target, self) {
    var getter = function(data) {
        //в кириллич окружении использовать кириллич буквы с комбинируемыми символами.
        //В лат - лат буквы с комбинируемыми символами
        var data = data.normalize('NFD')




        data = data.replace(/\u0418\u0306/g, "\u0419"); //Й(Й)——Й
        data = data.replace(/\u0438\u0306/g, "\u0439"); //й(й)——й

        data = data.replace(/\u0415\u0308/g,"\u0401"); 	//Ё(Е+̈)——Ё
        data = data.replace(/\u0435\u0308/g,"\u0451"); 	//ё(е+̈)——ё

        data = data.replace(/\u0401/g,"\u0415"); 	//Ё	——Е
        data = data.replace(/\u0451/g,"\u0435"); 	//ё	——е



        ////data = data.replace(/\u00E4/g,"\u0061\u0308"); 	//ä——ä(a+̈)


        data = data.replace(/\u0439\u0443/g,"\u044E"); 	//йу——ю


        data = data.replace(/надсмеивание/g,"высмеивание"); //надсмеивание=высмеивание
        data = data.replace(/высмеивание/g,"надсмеивание"); //надсмеивание=высмеивание




        data = data.replace(/([бвд])\.([аеиоӀу])/g,"$1$2"); //Николс — обработка точки после кирилл. класса
        data = data.replace(/([djbv])\.([äaeiouwy])/g,"$1$2"); //Николс — обработка точки после лат. класса


        data = data.replace(/(<code>)/g," "); //чтобы слова не слипались после удаления всех тегов





        //data = data.replace(/<br>/g,"\n");  //чтобы слова не слипались послу уд. тегов

        data = data.replace(/(\u0301|\u0300|\u0308|\u0302|\u030C|\u0304|<\/y>~|\u007C\u007C|<[^>]*>|\u00B6)/g,""); //¶=u00B6||̈=\u0308||    диапазон символов: [\u0300-\u036f]  [̀ - \u0300]









        //data = data.replace(/(\u04C0|\u04CF)/g, "\u0031"); /*палочки на единицу*/


        //data = data.replace(/(\u0041|\u0061)(\u0302|\u030C|\u0304|\u0306)/g,"\u0430"); 	//Ââ(â)/Ǎǎ(ǎ)/Āā(ā)/̆——а





        data = data.replace(/(\uA726)/g,"\u0048"); //Латинская заглавная буква heng НА H 
        data = data.replace(/(\uA727)/g,"\u0068"); //Латинская строчная буква heng  НА h 
        data = data.replace(/(\u00C6)/g,"\u0041"); //Латинская строчная заглавная AE Æ  НА  A
        data = data.replace(/(\u00E6)/g,"\u0061"); //Латинская строчная лигатура ae æ  НА  a



        data = data.replace(/(\d+)\u2012(\d+)/g,"$1\u002D$2"); //цифровое тире(‒) — на дефис
        data = data.replace(/\u2014/g,"\u002D"); //длинное тире(—) — на дефис

        //data = data.replace('\/\/', "\r\n"); //« // »    \u0020\u002F\u002F\u0020
        //console.log(data);
        return data;
    };




/* фрил // add: «else if {}» */
    if (target === "filterRow") { // && selectedFilterOperations == 'contains'
        return [function(dataItem) {
            var pattern = getter(value);
            //if (pattern == prevValue) {pattern = prevPattern;} else {prevValue = pattern; //Alex_Piggy add
            //pattern = pattern.replace(/(?<!\.)\*/g, '[\\u0400-\\u04FF\\w]*');
            pattern = pattern.replace(/\\b/g, '(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)');
            pattern = pattern.replace(/@/g, '[\\u0400-\\u04FF\\w]');
            pattern = pattern.replace(/,,/g, '.*');
            pattern = pattern.replace(/,/g, '([\\u0400-\\u04FF\\w]*|,)'); //добав. «|,» — для обработк. зап.

            //двойные в начале
            pattern = pattern.replace(/</g, '(оа|аь|яь|а|е|ё|и|о|у|ы|э|ю|я)');
            pattern = pattern.replace(/>/g, '(гӀ|кх|къ|кӀ|пӀ|тӀ|хь|хӀ|цӀ|чӀ|б|в|г|д|ж|з|й|к|л|м|н|п|р|с|т|ф|х|ц|ч|ш|щ|ъ|ь|Ӏ)');

            //для ОА — запрет А после О — о(?!а)
            pattern = pattern.replace(/(\d+)  /g, '(гӀ|кх|къ|кӀ|пӀ|тӀ|хь|хӀ|цӀ|чӀ|б|в|г|д|ж|з|й|к|л|м|н|п|р|с|т|ф|х|ц|ч|ш|щ|ъ|ь|Ӏ)*((оа|аь|яь|а|е|ё|и|о(?!а)|у|ы|э|ю|я)(гӀ|кх|къ|кӀ|пӀ|тӀ|хь|хӀ|цӀ|чӀ|б|в|г|д|ж|з|й|к|л|м|н|п|р|с|т|ф|х|ц|ч|ш|щ|ъ|ь|Ӏ)*){$1}');





            if (selectedFilterOperations == 'contains')
                pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}`;
            else
                 pattern = `(^|\\s|[^\\u0400-\\u04FF\\w]|\\b)${pattern}(?=\\s|[^\\u0400-\\u04FF\\w]|\\b|$)`;
            pattern = new RegExp(pattern, 'miu');
            //prevPattern = pattern;} //Alex_Piggy add
            var cell = getter(dataItem[self.dataField]);
            if (cell.match(pattern)) {
                return true;
            } else {
                return false;
            }
        }, "=", true];
    } else {
        return [function(dataItem) {
            return getter(dataItem[self.dataField]);
        }, selectedFilterOperations || 'contains', value];
    }
}



/*до-фриланс*/
/*
    if (target === "filterRow" && selectedFilterOperations == 'contains') // && selectedFilterOperations == 'contains'
    {
        return [function(dataItem)
        {
            var pattern = new RegExp(getter(value), 'i'),
                cell = getter(dataItem[self.dataField]);
            if (cell.match(pattern))
            {
                return true;
            }
            else
            {
                return false;
            }
        }, "=", true];
    }
    else
    {
        return [function(dataItem) { return getter(dataItem[self.dataField]); }, selectedFilterOperations || 'contains', value];
    }
}
*/


/*
//REGEX отдельно 
function gCalculateFilterExpression (value, selectedFilterOperations, target, self) {  
        if (target === "filterRow") {
            return [function(dataItem) {
        var pattern = new RegExp(value, 'i');
        if (dataItem[self.dataField].match(pattern)) {  
                    return true;  
                }  
                else {
                    return false;  
                }  
            }, "=", true];  
        }  
        else {  
            return self.defaultCalculateFilterExpression.apply(self, arguments);  
        }  
    }
*/


/*
//REGEX отдельно (ВАРИАНТ)
calculateFilterExpression: function (filterValue, selectedFilterOperation, target) {
    const columnField = this.dataField;
    var getter = function (data) {                                                 
        return data[columnField].normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g, "").replace(/\u0451/g,"\u0435");  
    };
    filterValue = filterValue.normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g, "").replace(/\u0451/g,"\u0435");
    return [getter, selectedFilterOperation || "contains", filterValue];
}
*/













//https://supportcenter.devexpress.com/Ticket/Details/T380360/dxdatagrid-nodatatext-into-a-link
//var nodata = [];  //ссылка для nodata №1

$(function(){
  $('#gridContainer').dxDataGrid({
    encodeHtml: true,


    /* скрытие опред-ных столбцов по классу, когда экран меньше... */
/*
    customizeColumns(col) {
        col.forEach(arr => {
            if (screen.width <= 700) {
                 // arr.cssClass === "c" || arr.cssClass === "e"
                if (arr.cssClass === "c" || arr.cssClass === "e") {
                    arr.visible = false;
                    $('.dx-datagrid-header-panel .dx-button-mode-contained').closest('div').css('background-color', '#FFC0C7').addClass('dx-button-mode-contained');
                }

                //$("div.el:contains('\u00a0')").css('display', 'none').addClass('zzzzzzzzzz');
            }
        });
    },
*/





    //hide-columns-onContextMenu
    onContextMenuPreparing: function(e) {  
        if (e.target == "header") {
            // e.items can be undefined
            if (!e.items) e.items = [null]; //Add: null
 
            // Add a custom menu item
            e.items.push({
                text: "Скрыть столбец",
                onItemClick: function() {
                    e.component.columnOption(e.column.caption, 'visible', false);
                }
            });
        } 
    },


    //Zebra
    rowAlternationEnabled: true,

    //??showTotalsPrior       : "both",

/*
    paging: {pageSize: 10},
    pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [10, 25, 50, 100]
    },
*/

    dataSource: allData,
        columnsAutoWidth: true,
        showBorders: true,
        loadPanel: {
            enabled: true
        },
    //filterPanel: {visible: true}, //не ищет по рег.в.
//REGEX - для обновления результатов
    cacheEnabled: false,
//ColumnReordering
    allowColumnReordering: true,
//ColumnResizing
    allowColumnResizing: true,
    showBorders: true,
    columnResizingMode: "nextColumn",
    columnMinWidth: 28,
    columnAutoWidth: true,
/*
//Export to Excel <script src="jszip.min.js"></script>
    selection: {mode: "multiple"},
    export: {
        enabled: true,
        fileName: "a",
        allowExportSelectedData: true
    },
*/

    //groupPanel: {visible: true},

    columnChooser: {enabled: true, mode: "select"},




    /* АДАПТИВНОСТЬ, см hidingPriority */
/*
    columnHidingEnabled: true,
    showBorders: true,
    grouping: {
        contextMenuEnabled: true,
        expandMode: "rowClick"
    },   
    groupPanel: {
        emptyPanelText: "Use the context menu of header columns to group data",
        visible: true
    },
    pager: {
        allowedPageSizes: [5, 8, 15, 30],
        showInfo: true,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true
    },
    paging: {
        pageSize: 8
    },
*/

    selection: {mode: "single"}, //"multiple"
    scrolling: {mode: "virtual"}, //"infinite"
            
    //onContentReady: function(e) { //после отрисовки страницы
    //},
    searchPanel: {
        encodeHtml: false,
        visible: true,
        width: 218,
        placeholder: "↑ Глобальный поиск…"


/*
    //удаление акцентов, тегов - для отдельного использования
    calculateFilterExpression: function(value, selectedFilterOperation, target){
    var getter = function(data) {
        var data  = data['a'].normalize('NFD').replace(/\u0451/g,"\u0435"); //ё—е
        return data;
    };
    value = value.normalize('NFD').replace(/\u0451/g,"\u0435"); //ё—е
    return [getter, selectedFilterOperation || "contains", value];
    }
*/


    },
/*
    editing: {
        editMode: "batch",
        editEnabled: true,
        removeEnabled: true,
        insertEnabled: true
    },
*/
    filterRow: {
        encodeHtml: false,
        visible: true,
        applyFilter: "auto"
    },
    headerFilter: {
        encodeHtml: false,
        visible: true
    },
    columns: [
    {
        //hidingPriority: 1, //приоритет для адаптивности
        placeholder: "↓ Фильтр…",
        //allowFiltering: false,
        //headerFilter: false,
        //allowSorting: false,
        encodeHtml: false,
        width: '28',  //см "columnMinWidth"
        dataField: 'a',
        //alignment: "right",  //!!
        caption: '▤ Источники',
        cssClass: "a", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"


        //удаление акцентов, тегов - для отдельного использования
        calculateFilterExpression: function(value, selectedFilterOperation, target){
        var getter = function(data) {
            var data  = data['a'].normalize('NFD').replace(/<[^>]*>/g,"");
            return data;
        };
        value = value.normalize('NFD').replace(/<[^>]*>/g,"");
        return [getter, selectedFilterOperation || "contains", value];
        }



/*
        //удаление акцентов, тегов - для отдельного использования
        calculateFilterExpression: function(value, selectedFilterOperation, target){
        var getter = function(data) {
            var data  = data['b'].normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g,""); //||
            data = data.replace(/\u0451/g,"\u0435"); //ё—е
            //data = data.replace('\/\/', "\r\n"); //« // »    \u0020\u002F\u002F\u0020
            return data;
        };
        value = value.normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g,"");
        value = value.replace(/\u0451/g,"\u0435"); //ё—е
        return [getter, selectedFilterOperation || "contains", value];
        }
*/

    },
    {
        //hidingPriority: 1, //приоритет для адаптивности
        placeholder: "↓ Фильтр (RegEx)…",
        allowHeaderFiltering: false,
        //allowFiltering: false,
        //headerFilter: false,
        //allowSorting: false,
        encodeHtml: false,
        width: '37%',
        dataField: 'b',
        caption: 'Инг.<v>+Рус',
        //caption: '<ing>',
        headerCellTemplate: function (header, info) {
            $('<div>')
                .html(info.column.caption)
                //.css('font-size', '16px')
                .appendTo(header);
        },
        cssClass: "b", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"



        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.b){
             var text = rowData.b.replace(/#/g,"");
             //////text = text.replace(/(<li><b>.*?<\/b>)\r\n<li><l>(<b>.*?<\/b>)<\/l>/g, "<li>$2$1");
             text = text.replace(/(\|\|)/g, "<sep3>||</sep3>");

             //<im>D:/grp_027/Истинг.jpg</im>
//<im_100>D:/Lib/(КАВКАЗ/(PICs/(Г1АЬРЧОШ/(((((((((GRPs/grp_028/isting_studio_79982081_200222814441797_8323120951432449976_n.jpg</im_100><im_60>D:/Lib/(КАВКАЗ/(PICs/(Г1АЬРЧОШ/(((((((((GRPs/grp_028/isting_studio_79982081_200222814441797_8323120951432449976_n.jpg</im_60><im_60>D:/Lib/(КАВКАЗ/(PICs/(Г1АЬРЧОШ/(((((((((GRPs/grp_028/17 век — Фуртоуг — «Истинг фамилии Ахриевых».png</im_60>
             //text = text.replace(/<im_100>(.*?)<\/im_100>/g,"<a href='$1' target='blank'><img class='im_100' src='$1'></a>");
             //text = text.replace(/<im_60>(.*?)<\/im_60>/g,"<a href='$1' target='blank'><img class='im_60' src='$1'></a>");

//Николс
//Николс
//Николс
             //text = text.replace(/(\u0431|\u0432|\u0434)\u002E(\u0430|\u0435|\u0438|\u043E|\u04C0|\u0443)/g,"<cc>$1</cc>$2"); //Николс — обработка точки после кирилл. класса
             //text = text.replace(/([djbv])\.([äaeiouwy])/g,"<cc>$1</cc>$2"); //Николс — обработка точки после лат. класса

   text = text.replace(/<tag>(Climb)<\/tag>/g, "<abr ttl='?'>$1</abr>");
   text = text.replace(/<tag>(SubInd)<\/tag>/g, "<abr ttl='?'>$1</abr>");
   text = text.replace(/<tag>(All)<\/tag>/g, "<abr ttl='Аллятивный падеж'>$1</abr>");
   text = text.replace(/<tag>(Abl)<\/tag>/g, "<abr ttl='Аблативный падеж'>$1</abr>");
   text = text.replace(/<tag>(Csn)<\/tag>/g, "<abr ttl='Сравнительный падеж'>$1</abr>");
   text = text.replace(/<tag>(Comp|Compl)<\/tag>/g, "<abr ttl='Комплементация'>$1</abr>");
   text = text.replace(/<tag>(CV)<\/tag>/g, "<abr ttl='Деепричастие'>$1</abr>");
   text = text.replace(/<tag>(Dat)<\/tag>/g, "<abr ttl='Дательный падеж'>$1</abr>");
   text = text.replace(/<tag>(Erg)<\/tag>/g, "<abr ttl='Эргативный падеж'>$1</abr>");
   text = text.replace(/<tag>(Gen)<\/tag>/g, "<abr ttl='Родительный падеж'>$1</abr>");
   text = text.replace(/<tag>(Goal)<\/tag>/g, "<abr ttl='Цель действия'>$1</abr>");
   text = text.replace(/<tag>(Inf)<\/tag>/g, "<abr ttl='Инфинитив'>$1</abr>");
   text = text.replace(/<tag>(Ins|Instr)<\/tag>/g, "<abr ttl='Творительный падеж'>$1</abr>");
   text = text.replace(/<tag>(Lat)<\/tag>/g, "<abr ttl='Лативный падеж'>$1</abr>");
   text = text.replace(/<tag>(Location)<\/tag>/g, "<abr ttl='Местоположение'>$1</abr>");
   text = text.replace(/<tag>(Nom)<\/tag>/g, "<abr ttl='Именительный падеж'>$1</abr>");
   text = text.replace(/<tag>(Obl)<\/tag>/g, "<abr ttl='Косвенный падеж'>$1</abr>");
   text = text.replace(/<tag>(Source)<\/tag>/g, "<abr ttl='Источник'>$1</abr>");
   text = text.replace(/<tag>(predicate nominal)<\/tag>/g, "<abr ttl='Предикативное имя'>$1</abr>");
   text = text.replace(/<tag>(no core arguments)<\/tag>/g, "<abr ttl='Нет основных аргументов'>$1</abr>");


   text = text.replace(/<t3>\[(1|2|3|3x|4|5|6|7|8|9|10|11|12|13|14|15)\]<\/t3>/g, "<a class='bord_bott' href='src/izd/Nichols2004.html#nic_$1' target='blank'><t3>[$1]</t3></a>");
   text = text.replace(/<t3>\[(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI)\]<\/t3>/g, "<a class='bord_bott' href='src/izd/Nichols2004.html#nic_$1' target='blank'><t3>[$1]</t3></a>");

   text = text.replace(/→ (XIII|XI)\?/g, "→ <a class='bord_bott' href='src/izd/Nichols2004.html#nic_$1' target='blank'>$1</a>?");
   text = text.replace(/-(VI)\?/g, "-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_$1' target='blank'>$1</a>?");



   text = text.replace(/&lt;IRV-(d\.aalar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daalar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.alar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_dalar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.ar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_dar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.aaqqar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daaqqar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.aar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.aaxkar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daaxkar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.ahwar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_dahwar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.axar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daxar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(d\.ettar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_dettar' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV-(guor|xalar)&gt;/g, "&lt;IRV-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_$1' target='blank'>$1</a>&gt;");
   text = text.replace(/&lt;IRV\?-(d\.axkar) /g, "&lt;IRV?-<a class='bord_bott' href='src/izd/Nichols2004.html#nic_daxkar' target='blank'>$1</a> ");
/*
ettar
d.ahwar
d.axkar
<IRV-daaghar>
<IRV? deitar: дайта (айдайт, айдайтад>
<IRV?-daastar даста (доаст, даьстад)>
<IRV?-duolar до́ла/дол/деннад>
<IRV?-wer Ӏе́ (Ӏа, Ӏийнад)>
<IRV?-xaalar ха́ла (хоал, хаьлад?)>
<IRV?-xaalar цаха́ла (цахоал, цахаьлай)>
*/



             //return text;
             return b_d_column_repl(text);
           }
        },

/*
        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.b){
             var text = rowData.b.replace(/#/g,"");
             //text = text.replace(/(—)/g, "–");  //длинное тире — на среднее
             return text;
           }
        },
*/

        //sortOrder: 'asc', //undefined | 'asc' | 'desc'
        filterOperations: ['contains','='],
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        }
    },
    {
        //hidingPriority: 0, //приоритет для адаптивности
        placeholder: "↓ Фильтр…",
        //allowFiltering: false,
        //headerFilter: false,


        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.c){
             var text = rowData.c.replace(/#/g,"");
             text = text.replace(/(\|)/g, "<sep>|</sep>\n");
             return text;
           }
        },
        headerFilter: {
          dataSource: function(options){
                options.dataSource.pageSize = 2000; //https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#pageSize
                options.dataSource.postProcess = function (results) {
                    let x = results.reduce(function(map, entry) {
                        //let newItems = entry.value.split('|');
                        let newItems = entry.value ? entry.value.split('<sep>|</sep>\n') : [];
                        return map.concat(newItems);
                    }, [])
                    .filter((e, i , arr) => arr.indexOf(e) === i && e.length)
                    .sort(function(a, b) { //сортировка
                        var a = a.toLowerCase(), b = b.toLowerCase();
                        return a < b ? -1 : (a > b ? 1 : 0);
                    })
                    .map((e, i , arr) => ({text:e, value:['c', 'contains', e]}));
                    return x;
                };
            }
        },


        //allowSorting: false,
        encodeHtml: false,
        width: '10%',
        dataField: 'c',
        //alignment: "right",  //!!
        caption: 'Сокр.',
        cssClass: "c", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"




        //удаление акцентов, тегов - для отдельного использования
        calculateFilterExpression: function(value, selectedFilterOperation, target){
        var getter = function(data) {
            var data = data['c'].normalize('NFD').replace(/<[^>]*>/g,"");
            return data;
        };
        value = value.normalize('NFD').replace(/<[^>]*>/g,"");
        return [getter, selectedFilterOperation || "contains", value];
        }







    },
    {
        //hidingPriority: 1, //приоритет для адаптивности
        placeholder: "↓ Фильтр (RegEx)…",
        allowHeaderFiltering: false,
        encodeHtml: false,
        width: '44%',
        dataField: 'd',
        caption: 'Рус.<v>+Инг+Eng',
        //caption: '<rus>',
        headerCellTemplate: function (header, info) {
            $('<div>')
                .html(info.column.caption)
                //.css('font-size', '16px')
                .appendTo(header);
        },
        cssClass: "d", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"


        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.d){
             var text = rowData.d.replace(/#/g,"");
             //var text = rowData.d.replace(/(—)/g, "–");  //длинное тире — на среднее
             text = text.replace(/(●)/g, "<sep2>●</sep2>");


             text = text.replace(/ — /g, "&nbsp;— ");

             //text = text.replace(/( \d+\)| \d+\.) /g, "<br><li>$1 ");
             //text = text.replace(/([бвд])\.([аеиоӀу])/g,"<cc>$1</cc>$2"); //Николс — обработка точки после кирилл. класса
             //text = text.replace(/([djbv])\.([äaeiouwy])/g,"<cc>$1</cc>$2"); //Николс — обработка точки после лат. класса



             //return text;
             return b_d_column_repl(text);
           }
        },



/*
        //удаление акцентов, тегов - на месте
        calculateFilterExpression: function(value, selectedFilterOperations, target){  
            var getter = function(data) {  
              var data = data['d'].normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g,"444").replace(/\u0451/g,"\u0435"); //¶||
              //data = data.replace(/\u0451/g,"\u0435"); //ё—е







              //data = data.replace('\/\/', "\r\n"); //« // »    \u0020\u002F\u002F\u0020
              //...
              return data;
            };  
 
            value = value.normalize('NFD').replace(/([\u0300-\u036f]|<y><\/y>~|\u007C\u007C|<[^>]*>)/g,"444").replace(/\u0451/g,"\u0435"); //¶||
            value = value.replace(/\u0451/g,"\u0435"); //ё—е
 
            return [getter, selectedFilterOperations || "contains", value];  
        },
*/




        //ссылка на функцию с REGEX
        filterOperations: ['contains','='],
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        },






    },
    {
        //hidingPriority: 1, //приоритет для адаптивности
        placeholder: "↓ Фильтр…",
        //allowFiltering: false,
        //headerFilter: false,



        headerFilter: {
          dataSource: function(options){
                options.dataSource.pageSize = 2000;
            }
        },
        /*фриланс:*/ /*
        headerFilter: {
          dataSource: function(options){
                options.dataSource.pageSize = 2000; //https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#pageSize
                options.dataSource.postProcess = function (results) {
                    let x = results.reduce(function(map, entry) {
                        //let newItems = entry.value.split('|');
                        let newItems = entry.value ? entry.value.split('|') : [];
                        return map.concat(newItems);
                    }, [])
                    .filter((e, i , arr) => arr.indexOf(e) === i && e.length)
                    //сортировка
                    .sort(function(a, b) {
                        var a = a.toLowerCase(), b = b.toLowerCase();
                        return a < b ? -1 : (a > b ? 1 : 0);
                    })
                    .map((e, i , arr) => ({text:e, value:['e', 'contains', e]}));
                    return x;
                };
            }
        },*/




        //allowSorting: false,
        encodeHtml: false,
        width: '10%',
        dataField: 'e',
        //alignment: "right",  //!!
        caption: 'Рубрикатор',
        cssClass: "e", //Задает классCSS,прим-ый к яч-м: ".dx-data-row .cell-highlighted {"



        //удаление/замены ИЗ ОТОБРЖАЕМЫХ РЕЗУЛЬТАТОВ
        calculateCellValue: function(rowData){
           if(rowData.e){
             var text = rowData.e.replace(/#/g,"");
             text = text.replace(/(МатТерм1933)/g, "Математические термины для ингушской начальной школы (1933)");
             text = text.replace(/(Терм01-)/g, "Термины: 01\) Земля, почва, рельеф, географические обозначения");
             text = text.replace(/(Терм02-)/g, "Термины: 02\) Государства, города, сельские поселения, водоемы");
             text = text.replace(/(Терм03-)/g, "Термины: 03\) Этнонимы");
             text = text.replace(/(Терм04-)/g, "Термины: 04\) Календарь, времена года, дни недели, части суток");
             text = text.replace(/(Терм05-)/g, "Термины: 05\) Растения");
             text = text.replace(/(Терм06-)/g, "Термины: 06\) Млекопитающие");
             text = text.replace(/(Терм07-)/g, "Термины: 07\) Птицы");
             text = text.replace(/(Терм08-)/g, "Термины: 08\) Насекомые");
             text = text.replace(/(Терм09-)/g, "Термины: 09\) Рыбы и другие водные обитатели");
             text = text.replace(/(Терм10-)/g, "Термины: 10\) Пресмыкающиеся и земноводные");
             text = text.replace(/(Терм11-)/g, "Термины: 11\) Пчеловодство");
             text = text.replace(/(Терм12-)/g, "Термины: 12\) Родство");
             text = text.replace(/(Терм13-)/g, "Термины: 13\) Профессии, социальное положение человека");
             text = text.replace(/(Терм14-)/g, "Термины: 14\) Поселения, строения и стройматериалы");
             text = text.replace(/(Терм15-)/g, "Термины: 15\) Предметы домашнего обихода");
             text = text.replace(/(Терм16-)/g, "Термины: 16\) Предметы туалета, курительных принадлежностей");
             text = text.replace(/(Терм17-)/g, "Термины: 17\) Предметы одежды, обуви, тканей, головных уборов");
             text = text.replace(/(Терм18-)/g, "Термины: 18\) Пища, пищевые продукты и напитки");
             text = text.replace(/(Терм19-)/g, "Термины: 19\) Корма животных");
             text = text.replace(/(Терм20-)/g, "Термины: 20\) Болезни сельскохозяйственных животных");
             text = text.replace(/(Терм21-)/g, "Термины: 21\) Орудия труда и их части");
             text = text.replace(/(Терм22-)/g, "Термины: 22\) Оружие, его части, военная терминология");
             text = text.replace(/(Терм23-)/g, "Термины: 23\) Виды транспорта и их частей");
             text = text.replace(/(Терм24-)/g, "Термины: 24\) Обозначения огня, светильников");
             text = text.replace(/(Терм25-)/g, "Термины: 25\) Свадебные обряды");
             text = text.replace(/(Терм26-)/g, "Термины: 26\) Досуг");
             text = text.replace(/(Терм27-)/g, "Термины: 27\) Смерть человека");
             text = text.replace(/(Терм28-)/g, "Термины: 28\) Деньги, мера веса и измерения");
             text = text.replace(/(Терм29-)/g, "Термины: 29\) Религия");
             text = text.replace(/(Терм30-)/g, "Термины: 30\) Социум");
             text = text.replace(/(Терм31-)/g, "Термины: 31\) Наука");
             text = text.replace(/(Терм32-)/g, "Термины: 32\) Лингвистика");
             text = text.replace(/(Терм33-)/g, "Термины: 33\) Астрономия");
             text = text.replace(/(Терм34-)/g, "Термины: 34\) Абстрактные понятия");





             //text = text.replace(/(.*?)/g, "<span title='$1'>$1</span>");



             text = text.replace(/(\|)/g, "<sep>|</sep>\n");
             return text;
           }
        },
        headerFilter: {
          dataSource: function(options){
                options.dataSource.pageSize = 2000; //https://js.devexpress.com/Documentation/ApiReference/Data_Layer/DataSource/Configuration/#pageSize
                options.dataSource.postProcess = function (results) {
                    let x = results.reduce(function(map, entry) {
                        //let newItems = entry.value.split('|');
                        let newItems = entry.value ? entry.value.split('<sep>|</sep>\n') : [];
                        return map.concat(newItems);
                    }, [])
                    .filter((e, i , arr) => arr.indexOf(e) === i && e.length)
                    .sort(function(a, b) { //сортировка
                        var a = a.toLowerCase(), b = b.toLowerCase();
                        return a < b ? -1 : (a > b ? 1 : 0);
                    })
                    .map((e, i , arr) => ({text:e, value:['e', 'contains', e]}));
                    return x;
                };
            }
        },









    }
/* ,
    {
        encodeHtml: false,
        width: '12%',
        dataField: 'c',
        caption: '#3',
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        },
        cssClass: "cell-highlighted" //Задает класс CSS, применяемый к ячейкам:
                                     //.dx-data-row .cell-highlighted {
    },
    {
        //cssClass: "znachenie" //Задает класс CSS, применяемый к ячейкам:
                                     //.dx-data-row .cell-highlighted {
        //allowSorting: false,
        encodeHtml: false,
        width: '53%',
        dataField: 'd',
        caption: '#4',
        calculateFilterExpression: function (value, selectedFilterOperations, target) {  
            return gCalculateFilterExpression (value, selectedFilterOperations, target, this);
        }
      }
*/
    ],
        summary: {totalItems: [{column: "b", summaryType: "count"}]},		//Total Summaries






    onContentReady: function(e) { //после отрисовки страницы
        e.component.option("loadPanel.enabled", false);



        $('#id_input').attr('placeholder', 'Глобальный поиск…');



        $('trl').closest('li').addClass('li_trl'); //отдельный окрас тире для LI


        $('tr td:first-child ant21').closest('td').css('background-color', '#000000').addClass('ant21');
        $('tr td:first-child ant17').closest('td').css('background-color', '#471D1C').addClass('ant17');
        $('tr td:first-child dud15').closest('td').css('background-color', '#c2af9a').addClass('dud15');
        $('tr td:first-child kod21').closest('td').css('background-color', '#1f3c8e').addClass('kod21');
        $('tr td:first-child irt16').closest('td').css('background-color', '#96391d').addClass('irt16');
        $('tr td:first-child irsns').closest('td').css('background-color', '#009878').addClass('irsns');
        $('tr td:first-child kodkt').closest('td').css('background-color', '#55a72a').addClass('kodkt');
        $('tr td:first-child raz01').closest('td').css('background-color', '#E91344').addClass('raz01');
        $('tr td:first-child raz02').closest('td').css('background-color', '#E91344').addClass('raz02');
        $('tr td:first-child med19').closest('td').css('background-color', '#FDA230').addClass('med19');
        $('tr td:first-child kod18').closest('td').css('background-color', '#144D25').addClass('kod18');
        $('tr td:first-child its33').closest('td').css('background-color', '#E2C36C').addClass('its33');
        $('tr td:first-child uzh27').closest('td').css('background-color', '#99AFCB').addClass('uzh27');
        $('tr td:first-child selaa').closest('td').css('background-color', '#D300C9').addClass('selaa');
        $('tr td:first-child xayor').closest('td').css('background-color', '#00FF7F').addClass('xayor');
        $('tr td:first-child kar95').closest('td').css('background-color', '#A9A9A9').addClass('kar95');
        $('tr td:first-child kur05').closest('td').css('background-color', '#114b3a').addClass('kur05');
        $('tr td:first-child nic04').closest('td').css('background-color', '#202a6d').addClass('nic04');
        // ...












  /* https://supportcenter.devexpress.com/ticket/details/t380360/dxdatagrid-nodatatext-into-a-link */
        var noDataSpan = e.component.element().find(".dx-datagrid-nodata");
        //var hyperlink = $('<a href="about.html" class="dx-datagrid-nodata" style="z-index:3" target="blank">Не найдено</a>');
        var hyperlink = $('<div class="dx-datagrid-nodata" style="z-index:3;text-align:center;font-size:16px;">Не найдено<br><br><img width="250" height="250" src="src/img/search.png" onclick="window.open(this.src)" style="padding: 5px;">').attr('class', noDataSpan.attr('class'));  
        noDataSpan.replaceWith(hyperlink);
/*<a href="about.html" target="blank">*/



/* <br><div style="text-align:left; font-size:13px;"><table class="dx-nodata" align="center" valign="top" cellpadding="0pt"><tr><td colspan="2" width="100">Верхние фильтры <r>&uarr;</r> ведут поиск внутри колонок<br>в начальной позиции слов (по умолчанию),<br>или (при выборе опции слева от фильтра) по<br><r2>целым словам</r2> с использованием спец. знаков:</td></tr><tr><td>&nbsp;</td></tr><tr><td class="nd-code" width="27">@</td><td>— соответствует любой одной букве в слове</td></tr><tr><td class="nd-code">&nbsp;,</td><td>— нулю или более неизвестных букв в слове</td></tr><tr><td class="nd-code">&nbsp;,,</td><td>— любому количеству произвольных знаков</td></tr><tr><td>&nbsp;</td></tr><tr><td class="nd-code">АЗ</td><td>— найти целые слова <code>АЗ</code></td></tr><tr><td class="nd-code">АЗ / АЗ,</td><td>— найти слова, начинающиеся на <code>АЗ</code></td></tr><tr><td class="nd-code">,АЗ</td><td>— найти оканчивающиеся на <code>АЗ</code></td></tr><tr><td class="nd-code">,АЗ,</td><td>— найти содержащие <code>АЗ</code> в середине</td></tr><tr><td class="nd-code">А,З</td><td>— найти слова с <code>А</code> в начале и <code>З</code> в конце</td></tr><td>&nbsp;</td></tr><tr><td colspan="2" width="100%">Закреплённый внизу <r>&darr;</r> <r2>простой</r2> поиск, ищет<br>соответствия по всей таблице и в любой<br>позиции текста. <i>Подробнее см. «<u onclick="location.href=\'about.html\'">О проекте</u>»</i>.</td></tr><tr></table></div></div> */





/* https://supportcenter.devexpress.com/ticket/details/t380360/dxdatagrid-nodatatext-into-a-link */
/*
$(window).on('resize', function(){  
    $("#gridContainer").dxDataGrid('instance').repaint();  
});
*/






    },







/*
        grouping: {
            contextMenuEnabled: true
        },
        groupPanel: {
            visible: true   // or "auto"
        }
*/
  });
});






//[ΙIl1]Ӏ	———	dx.all.js	———	_createInput:function(){var e=(0,i.default)("<input onkeyup='fix(this)' type='text' minlength='1' required title='' class='md-input' Xplaceholder=''>
function fix(obj) {


/*
   obj.value = obj.value.replace(/[áàâǎăãảạäåāąấầẫẩậắằẵẳặǻ]/g, 'а');
   obj.value = obj.value.replace(/[éèêěĕẽẻėëēęếềễểẹệ]/g, 'е');
   obj.value = obj.value.replace(/[óòŏôốồỗổǒöőõøǿōỏơớờỡởợọộ]/g, 'о');
úùứừ
ýỳŷẏỵÿȳỹẙyƴỷɏ
*/
   obj.value = obj.value.replace(/[́̀]/g, '');


   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)á[а-яё])|([а-яё])á(\s|\b|[^\w]|$|[а-яё]))/gi, function(m) {return m.replace('á', 'а');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)é[а-яё])|([а-яё])é(\s|\b|[^\w]|$|[а-яё]))/gi, function(m) {return m.replace('é', 'е');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ó[а-яё])|([а-яё])ó(\s|\b|[^\w]|$|[а-яё]))/gi, function(m) {return m.replace('ó', 'о');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ú[а-яё])|([а-яё])ú(\s|\b|[^\w]|$|[а-яё]))/gi, function(m) {return m.replace('ú', 'и');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ý[а-яё])|([а-яё])ý(\s|\b|[^\w]|$|[а-яё]))/gi, function(m) {return m.replace('ý', 'у');});

   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)á[a-z])|([a-z])á(\s|\b|[^\w]|$|[a-z]))/gi, function(m) {return m.replace('á', 'a');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)é[a-z])|([a-z])é(\s|\b|[^\w]|$|[a-z]))/gi, function(m) {return m.replace('é', 'e');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ó[a-z])|([a-z])ó(\s|\b|[^\w]|$|[a-z]))/gi, function(m) {return m.replace('ó', 'o');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ú[a-z])|([a-z])ú(\s|\b|[^\w]|$|[a-z]))/gi, function(m) {return m.replace('ú', 'u');});
   obj.value = obj.value.replace(/(((\s|\b|[^\w]|^)ý[a-z])|([a-z])ý(\s|\b|[^\w]|$|[a-z]))/gi, function(m) {return m.replace('ý', 'y');});



   //палочки на единицу:  data = data.replace(/(\u04C0|\u04CF)/g, "\u0031");

   //obj.value = obj.value.replace(/[ΙIl1][ΙIl1]([Ӏ,@\.йцукенгшщзхъфывапролджэячсмитьбюё])/g, 'ӀӀ$1');
   //obj.value = obj.value.replace(/[ΙIl1][ΙIl1]([Ӏ,@\.ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ])/g, 'ӀӀ$1');

   obj.value = obj.value.replace(/([Ӏ,@\.а-яёА-ЯЁ])[ΙIl1]/g, '$1Ӏ');
   obj.value = obj.value.replace(/[ΙIl1]([Ӏ,@\.а-яёА-ЯЁ])/g, 'Ӏ$1');


//https://ikfi.ru/article/granica-slova-b-i-kirillica-v-javascript
//var rx_string = "(^|\\s|[^\\u0400-\\u04FF]|\\b)" + item.replace(".", "\\.") + "(?=\\s|[^\\u0400-\\u04FF]|\\b|$)";

/*
   obj.value = obj.value.replace(/([^\\|\.])[\*,]/g, "$1\(\[a-zа-яёӀl1IΙ\]\+\)\?");

   obj.value = obj.value.replace('\\\\\\', "(^|\\s|[^\\u0400-\\u04FF]|\\b)");
   obj.value = obj.value.replace('\/\/\/', "(?=\\s|[^\\u0400-\\u04FF]|\\b|$)");

   obj.value = obj.value.replace('БББ', "<");
   obj.value = obj.value.replace('ЮЮЮ', ">");
*/

}


//общие замены для b-d-колонок
function b_d_column_repl(text) {
   text = text.replace(/(<t1>n\.<\/t1>)/g, "<abr ttl='Имя существительное'>$1</abr>");
   text = text.replace(/(<t1>adj\.<\/t1>)/g, "<abr ttl='Имя прилагательное'>$1</abr>");
   text = text.replace(/(<t1>adv\.<\/t1>)/g, "<abr ttl='Наречие'>$1</abr>");
   text = text.replace(/(<t1>num\.<\/t1>)/g, "<abr ttl='Числительное'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(v\. iter\. pl\.)/g, "<abr ttl='Глагол многократный, мн. ч.'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(v\. iter\.)/g, "<abr ttl='Глагол многократный'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(v\. simul\. pl\.)/g, "<abr ttl='Глагол однократный, мн. ч.'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(v\. simul\. sg\.)/g, "<abr ttl='Глагол однократный, ед. ч.'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(v\. simul\.)/g, "<abr ttl='Глагол однократный'>$1</abr>");
   text = text.replace(/(<t1>v\. pl\.<\/t1>)/g, "<abr ttl='Глагол, мн. ч.'>$1</abr>");
   text = text.replace(/(<t1>v\.<\/t1>)/g, "<abr ttl='Глагол'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(pl\. obj\.)/g, "<abr ttl='Мн. ч.'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(sg\. obj\.)/g, "<abr ttl='Ед. ч.'>$1</abr>");
   text = text.replace(/(<t1>pl\.<\/t1>)/g, "<abr ttl='Мн. ч.'>$1</abr>");

   text = text.replace(/(<i>See<\/i>)/g, "<abr ttl='Смотри'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(sp\.)/g, "<abr ttl='Вид'>$1</abr>");
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(spp\.)/g, "<abr ttl='Виды'>$1</abr>");
//sp. (сокр. от лат. species) — вид; используется после родового названия и обозначает, что таксон определён с точностью до рода
//spp. (сокр. от лат. species) — виды; используется после родового названия
//1. Используется в качестве собирательного видового эпитета для обозначения всех таксонов, входящих в род
//2. При использовании в списке таксонов рода: обозначает все остальные таксоны, входящие в этот род, которые не включены в данный список
   text = text.replace(/(?=\s|[^\u0400-\u04FF\w]|\b|$)(Id\.)/g, "<abr ttl='Идиома'>$1</abr>");











   ////////////
   ////////////
   ////////////
   ////////////
   ////////////
   //text = text.replace(/(?=\s|[^\w]|\b|$)(прил\.)/, "<abr ttl='Имя прилагательное'>$1</abr>"); //без g

   //Николс — обработка точки после кирилл./лат. класса
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");
   text = text.replace(/([бвд])\.([аеиоӀу])/,"<cls>$1</cls>$2");
   text = text.replace(/([djbv])\.([äaeiouwy])/,"<cls>$1</cls>$2");


   return text
}