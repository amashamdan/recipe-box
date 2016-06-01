/* Box component, it is the parent component. It includes a header, child components RecipeList and NewRecipeForm, and a button. */
var Box = React.createClass({
	/* Initially the page will show two sample recipes. Each recipe object has a key, name and a list of ingredients. newForm controls the diplay of the new recipe form once the New Recipe button is clicked. initally set to false. */
	getInitialState: function() {
		return ({recipes: [{
								key: 0,
								name: "Nice Sample",
								ingredients: ["Rice", "Chicken"]
							}, 
							{
								key: 1,
								name: "Great Sample",
								ingredients: ["Meat", "Sauce"]
							}],
				newForm: false});
	},
	/* Handler for clicking New Recipe button, the state of the new recipe from is set to true to render the new recipe form. */
	newClick: function() {
		this.setState({newForm: true});
	},
	/* Handler for submitting the new recipe form. It takes two arguments, recipe from and recipe's ingredients. */
	newRecipeSubmit: function(name, ingredients) {
		/* Since this.state.recipes is an array, this.setState cannot be used to add the new recipe. Below is the work around. */
		var recipes = this.state.recipes;
		var newRecipes = recipes.concat([{key: recipes.length , name: name, ingredients: ingredients}]);
		/* new recipe from is closed. */
		this.setState({recipes: newRecipes, newForm: false});
	},
	/* Handler for clicking cancel button on the new recipe form. */
	cancelNewRecipe: function() {
		this.setState({newForm: false});
	},
	render: function() {
		/* The render method returns the header, calls RecipeList, calls NewRecipeForm and adds a 'New Recipe' button at the bottom of the box. */
		return (
			<div className = "box">
				<h2 className="main-header">Available recipes</h2>
				<RecipeList recipes={this.state.recipes}/>
				<button className="new-recipe" onClick={this.newClick}>New Recipe</button>
				<NewRecipeForm status={this.state.newForm} onCancel={this.cancelNewRecipe} onSubmit={this.newRecipeSubmit}/>
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

/* The NewRecipeForm component. Displayed when New Recipe button is clicked. It has two inputs, a save button and a cancel button. */
var NewRecipeForm = React.createClass({
	/* form submit handler. eventually it'll call submit handler in Box to display information, this function passes the relevant information to Box. */
	submit: function(e) {
		e.preventDefault();
		/* The if statement ensures form doesn't get submitted if recipe name or ingredients are missing. A message is displayed asking user to enter inormation. */
		if (!$(".recipe-name").val() || !$(".recipe-ingredients").val()){
			alert("Please fill all fields.")
		} else {
			/* Entered text in ingredients fiels is saved into ingredientsArray. */
			var ingredientsArray = $(".recipe-ingredients").val();
			/* Ingredients should be seperated by commas, they're seperated and stored as individual elements back into ingredientsArray. */
			ingredientsArray = ingredientsArray.split(",");
			/* White spaces at the end or beginning are removed. */
			for (var ingredient in ingredientsArray) {
				ingredientsArray[ingredient] = ingredientsArray[ingredient].trim();
			}
			/* submit handler in Box is called. */
			this.props.onSubmit($(".recipe-name").val(), ingredientsArray);
		}

	},
	handleCancel: function(e) {
		e.preventDefault();
		this.props.onCancel();
	},
	render: function() {
		/* The diplay is controlled with status props. intially set to false. The "layer div is just a black background with some transparency. It has to be in its own div because of opcaity issues. A child cannot override its parent opcaity. So new-recipe-message is displayed above "layer" by controlling the z-index. */
		if (this.props.status) {
			return (
				<div>
					<div className="layer"></div>
					<form className="new-recipe-message" onSubmit={this.submit}>
						<h4>Enter new recipe details</h4>
						<label for="recipe-name">Recipe Name</label><br/>
						<input className="recipe-name" placeholder="Enter recipe name..." /><br/>
						<label for="recipe-ingredients">Ingredients</label><br/>
						<input className="recipe-ingredients" placeholder="Enter recipe ingredients..." /><br/>
						<button className="save">Save recipe</button>
						<button className="cancel" onClick={this.handleCancel}>Cancel</button>
					</form>
				</div>
			);
		} else {
			return (<div></div>);
		}
	}
})

/* Call to ReactDOM render method, it renderes a box and places it in box-container div */
ReactDOM.render(<Box/>, document.getElementById("box-container"));