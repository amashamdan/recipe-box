/* Box component, it is the parent component. It includes a header, a child component RecipeList and a button. */
var Box = React.createClass({
	/* Initially the page will show two sample recipes. Each recipe object has a key, name and a list of ingredients. */
	getInitialState: function() {
		return ({recipes: [{
								key: 0,
								name: "Sample1",
								ingredients: ["Rice", "Chicken"]
							}, 
							{
								key: 1,
								name: "Sample2",
								ingredients: ["Meat", "Sauce"]
							}]});
	},
	render: function() {
		/* The render method returns the header, calls RecipeList and adds a 'New Recipe' button at the bottom of the box. */
		return (
			<div className = "box">
				<h2 className="main-header">Available recipes</h2>
				<RecipeList recipes={this.state.recipes}/>
				<button className="new-recipe">New Recipe</button>
			</div>			
		);
	}
})

/* RecipeList component. This component displays all recipes. It has a child compenents RecipeDetails which are all initially hidden. Once a recipe name is clicked, RecipeDetails corresponding to that recipe is displayed. */
var RecipeList = React.createClass({
	/* state in this components holds the display status of each recipe. True means the recipe details will be displayed. False means they're hidden. getInitialState must return an object. initialState is initialized to an empty object. Then, each recipe key is used as propoerty in initialState and is set to false. initialState is then returned. */
	getInitialState: function() {
		var initialState = {};
		for (var recipe in this.props.recipes) {
			initialState[recipe] = false;
		}
		return initialState;
	},
	handleClick: function(recipe) {
		/* jQuery is the easiest way to show and hide elements. But states are used in this page to control rendering of details. $("#" + name).fadeToggle(); this command could've been used.*/
		/* recipe object is passed as function, it's key is found and used to negate the state. [recipe key] used because if we want to set a varialbe as a property, square brackets must be used. */
		this.setState({[recipe.key]: !this.state[recipe.key]});
	},
	render: function() {
		/* passing this.handleClick directly to onClick props results in error... seems like scoping error. So it's stored in handler varialbe outside of the return statement..*/
		var handler = this.handleClick;
		/* Same issue with this.state. */
		var status = this.state;
		/* For each recipe, a list item is created using map function. All items are stored in recipeElements array. a call to RecipeDetails is placed to render the details of the recipe if its status is true. the status is passed with the call to RecipeDtails */ 
		var recipeElements = this.props.recipes.map(function(recipe){
			/* Bind returns a function with a body same as the function it's bound to. this is resolved to the first argument.
			So when you call it with onfilechange.bind(null, playsound), it creates and returns a new function, always receiving playsound as first argument and using global context (Because null is used as context), just like all regular functions use global context */
			return (
				<li key={recipe.key}><span onClick={handler.bind(null, recipe)}>{recipe.name}</span><RecipeDetails status={status[recipe.key]} recipe={recipe} /></li>
			);
		});
		/* The unordered list is rendered, the list items are the contents of recipeElemnts array. */
		return (
			<ul className="recipe-list">
				{recipeElements}
			</ul>
		);
	}
})

/* RecipeDetails components. It includes details of a recipe, and two buttons, one to edit the recipe and one to delete it. */
var RecipeDetails = React.createClass({
	render: function() {
		/* The ingredients of a recipe are put in seperate divs. */
		var ingredients = this.props.recipe.ingredients.map(function(ingredient) {
			return (<div key={ingredient} className="ingredient">{ingredient}</div>);
		});
		/* If the status for a recipe is true, it is to be shown, and the details are rendered. */
		if (this.props.status) {
			return (
				<div className="recipe-details" id={this.props.recipe.name}>
					<h4 className="ingredients-header">Ingredients</h4>
					{ingredients}
					<button className="edit">Edit</button>
					<button className="delete">Delete</button>
				</div>
			);
		/* If status is false, an empty div is returned. */
		} else {
			return (<div></div>);
		}
	}
})

/* Call to ReactDOM render method, it renderes a box and places it in box-container div */
ReactDOM.render(<Box/>, document.getElementById("box-container"));