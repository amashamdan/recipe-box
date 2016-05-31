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
	handleClick: function(recipe) {
		console.log(recipe);
	},
	render: function() {
		/* passing this.handleClick directly to onClick props results in error... seems like scoping error. */
		var handler = this.handleClick;
		//var data = this.props.recipes; 
		var recipeElements = this.props.recipes.map(function(recipe){
			/* Bind returns a function with a body same as the function it's bound to. this is resolved to the first argument.
			So when you call it with onfilechange.bind(null, playsound), it creates and returns a new function, always receiving playsound as first argument and using global context (Because null is used as context), just like all regular functions use global context */
			return (
				<li key={recipe.name}><span onClick={handler.bind(null, recipe)}>{recipe.name}</span><RecipeDetails ingredients={recipe.ingredients} /></li>
				
			);
		});
		return (
			<ul className="recipe-list">
				{recipeElements}
			</ul>
		);
	}
})

var RecipeDetails = React.createClass({
	render: function() {
		var ingredients = this.props.ingredients.map(function(ingredient) {
			return (<div key={ingredient} className="ingredient">{ingredient}</div>);
		})
		return (
			<div className="recipe-details">
				<h4 className="ingredients-header">Ingredients</h4>
				{ingredients}
				<button className="edit">Edit</button>
				<button className="delete">Delete</button>
			</div>
		);
	}
})

ReactDOM.render(<Box/>, document.getElementById("box-container"));