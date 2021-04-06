import React from "react"

function FilterPosts(props) {

	function postLinkToTitle(elem) {
		return elem.getElementsByTagName('p')[0].innerText.split("\n")[0];
	}
	function postLinkToCategory(elem) {
		return elem.getAttribute('data-category');
	}

	function filterTitleText(elem, title_filter) {
		return postLinkToTitle(elem).toLowerCase().indexOf(title_filter) > -1;
	}
	function filterCategory(elem, category_filter) {
		return category_filter==='all' || category_filter===postLinkToCategory(elem)
	}

	function filter() {
		var title_filter = document.getElementById('titleFilterText').value.toLowerCase();
		var category_filter = document.getElementById('categoryFilterSelect').value.toLowerCase();
		var elems = document.getElementsByName('postlink');
		for (var i=0; i<elems.length; i++) {
			if (filterTitleText(elems[i], title_filter) && filterCategory(elems[i], category_filter)) {
				elems[i].style.display = "";
			} else {
				elems[i].style.display = "none";
			}
		}
	}

	React.useEffect(() => {
		//check for get params for filtering
		const queryParams = new URLSearchParams(window.location.search);
		let c = queryParams.get('category');
		if (c!==null && props.categories.includes(c)) {
			//set category
			document.getElementById('categoryFilterSelect').value = c;
			filter();
		}
	}, []); //gets called when the component is mounted

	const CategoryOptions = props.categories.map(v => <option key={v} value={v}>{v}</option>)
	return (<>
		<div className="filters">
			<select id="categoryFilterSelect" onChange={filter}>
				<option key="all" value="all">all</option>
				{CategoryOptions}
			</select>
			<input type="text" id="titleFilterText" onKeyUp={filter} placeholder="Search for post title..."/>
			<br />
		</div>
		{props.children}
	</>);
}
export default FilterPosts;