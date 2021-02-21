import React from "react"

function FilterPosts(props) {

	function postLinkToTitle(elem) {
		return elem.getElementsByTagName('p')[0].innerText.split("\n")[0];
	}
	function postLinkToCategory(elem) {
		return elem.getAttribute('data-category');
	}
	function postLinkToSubcategory(elem) {
		return elem.getAttribute('data-subcategory');
	}

	function filterTitleText(elem, title_filter) {
		return postLinkToTitle(elem).toLowerCase().indexOf(title_filter) > -1;
	}
	function filterCategory(elem, category_filter) {
		return category_filter==='all' || category_filter===postLinkToCategory(elem)
	}
	function filterSubcategory(elem, subcategory_filter) {
		return subcategory_filter==='-select category-' || subcategory_filter==='all' || subcategory_filter===postLinkToSubcategory(elem)
	}

	function filter() {
		var title_filter = document.getElementById('titleFilterText').value.toLowerCase();
		var category_filter = document.getElementById('categoryFilterSelect').value.toLowerCase();
		var subcategory_filter = document.getElementById('subcategoryFilterSelect').value.toLowerCase();
		var elems = document.getElementsByName('postlink');
		for (var i=0; i<elems.length; i++) {
			if (filterTitleText(elems[i], title_filter) && filterCategory(elems[i], category_filter) && filterSubcategory(elems[i], subcategory_filter)) {
				elems[i].style.display = "";
			} else {
				elems[i].style.display = "none";
			}
		}
	}

	function createAndAddOption(elem, k) {
		var opt = document.createElement('option');
		opt.setAttribute('key', k);
		opt.setAttribute('value', k);
		opt.innerText = k;
		elem.appendChild(opt);
	}

	function updateSubcategoryOptions() {
		//remove subcategory options
		var subelem = document.getElementById('subcategoryFilterSelect');
		while (subelem.firstChild) {
			subelem.removeChild(subelem.lastChild);
		}

		//add subcategory options based on category
		var category_filter = document.getElementById('categoryFilterSelect').value.toLowerCase();
		if (category_filter === 'all') {
			createAndAddOption(subelem, '-select category-');
		} else {	
			createAndAddOption(subelem, 'all');
			if (category_filter in props.subcategoryDict) {
				for (var i=0; i<props.subcategoryDict[category_filter].length; i++) {
					createAndAddOption(subelem, props.subcategoryDict[category_filter][i]);
				}
			}
		}
	}

	function onChangeCategory() {
		updateSubcategoryOptions();
		filter();
	}

	function getFilterParamsFromGetParams() {
		const paramSet = new Set(['category', 'subcategory']);
		var result = {}, tmp = [];
		window.location.search.substr(1).split("&").forEach(function (item) {
			tmp = item.split("=");
			if (paramSet.has(tmp[0])) {
				result[tmp[0]] = tmp[1];
			}
		})
		return result;
	}

	React.useEffect(() => {
		//check for get params for filtering
		var params = getFilterParamsFromGetParams();
		if ('category' in params && params['category'] in props.subcategoryDict) {
			//set category
			document.getElementById('categoryFilterSelect').value = params['category'];
			updateSubcategoryOptions();

			if ('subcategory' in params && props.subcategoryDict[params['category']].includes(params['subcategory'])) {
				//set subcategory
				document.getElementById('subcategoryFilterSelect').value = params['subcategory'];
			}
			filter();
		}
	}, []); //gets called when the component is mounted

	const CategoryOptions = props.categories.map(v => <option key={v} value={v}>{v}</option>)
	return (<>
		<div className="filters">
			<input type="text" id="titleFilterText" onKeyUp={filter} placeholder="Search for post title..."/>
			<select id="categoryFilterSelect" onChange={onChangeCategory}>
				<option key="all" value="all">all</option>
				{CategoryOptions}
			</select>
			<select id="subcategoryFilterSelect" onChange={filter}>
				<option key="-select category-" value="-select category-">-select category-</option> 
			</select>
		</div>
		{props.children}
	</>);
}
export default FilterPosts;