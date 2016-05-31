var Box = React.createClass({
	getInitialState: function() {
		return ({recipes: [{
								name: "Sample 1",
								ingredients: ["Rice", "Chicken"]
							}, 
							{
								name: "Sample 2",
								ingredients: ["Meat", "Sauce"]
							}]});
	},
	render: function() {
		return (
			<div className = "box">
				<h2 className="main-header">Available recipes</h2>
				<RecipeList recipes={this.state.recipes}/>
				<button className="new-recipe">New Recipe</button>
			</div>			
		);
	}
})

var RecipeList = React.createClass({
	render: function() {
		var recipeElements = this.props.recipes.map(function(recipe){
			return (
				<li key={recipe.name}>{recipe.name}</li>				
			);
		});
		return (
			<ul className="recipe-list">
				{recipeElements}
			</ul>
		);
	}
})

ReactDOM.render(<Box/>, document.getElementById("box-container"));