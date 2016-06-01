/* Box component, it is the parent component. It includes a header, child components RecipeList and NewRecipeForm, and a button. */
var Box = React.createClass({
	/* Initially the page will show two sample recipes. Each recipe object has a key, name and a list of ingredients. newForm controls the diplay of the new recipe form once the New Recipe button is clicked. initally set to false. c control the key assigned to each recipe object, since we're starting with 2 recipes (keys 0 and 1), c is intially set to 2. */
	getInitialState: function() {
		return ({recipes: [{
								key: 0,
								name: "Nutella Cake",
								ingredients: ["Nutella", "Eggs"]
							}, 
							{
								key: 1,
								name: "White Chocolate Pretzels",
								ingredients: ["White Chocolate Melts", "Pretzels"]
							}],
				newForm: false,
				c: 2});
	},
	/* Handler for clicking New Recipe button, the state of the new recipe from is set to true to render the new recipe form. */
	newClick: function() {
		this.setState({newForm: true});
	},
	/* Handler for submitting the new recipe form. It takes two arguments, recipe from and recipe's ingredients. */
	newRecipeSubmit: function(name, ingredients) {
		/* Since this.state.recipes is an array, this.setState cannot be used to add the new recipe. Below is the work around. */
		var recipes = this.state.recipes;
		var newRecipes = recipes.concat([{key: this.state.c , name: name, ingredients: ingredients}]);
		/* newC holds the new value of c (the key of the next recipe) */
		var newC = this.state.c + 1;
		/* new recipe from is closed, is incremented */
		this.setState({recipes: newRecipes, newForm: false, c: newC});
	},
	/* Handler for clicking cancel button on the new recipe form. */
	cancelNewRecipe: function() {
		this.setState({newForm: false});
	},
	/* Handler for editing a recipe. it removes the edited recipe using its key and replaces it with the nwe recipe. */
	editSubmit: function(key, newName, newIngredients) {
		var recipes = this.state.recipes;
		recipes.splice(key, 1, {key: key, name: newName, ingredients: newIngredients});
		this.setState({recipes: recipes});
	},
	/* Handler for deleting a recipe. it removes the edited recipe using its key. */
	deleteHandler: function(key) {
		var recipes = this.state.recipes;
		/* The index of the recipe in recipes is found by looping through recipes and locationg which recipe has a matching key. recipes is spliced using index.
		Didn't use recipes.splice(key, 1), because let's say we have thee recipes 0, 1, 2. If we delete 1, recipe 2 will then have index 1 in the array, if we try to delete it, it won't be removed because key is 2 and there is no index 2. */
		for (var recipe in recipes) {
			if (recipes[recipe].key === key){
				var index = recipe;
			}
		}
		recipes.splice(index, 1);
		this.setState({recipes: recipes});
	},
	render: function() {
		/* The render method returns the header, calls RecipeList, calls NewRecipeForm and adds a 'New Recipe' button at the bottom of the box. */
		return (
			<div className = "box">
				<h2 className="main-header">Available recipes</h2>
				<RecipeList recipes={this.state.recipes} editSubmit={this.editSubmit} onDelete={this.deleteHandler}/>
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
	/* Recieves edited recipe details and passes them to editSubmit handler in Box. */
	editSubmit: function(key, newName, newIngredients) {
		this.props.editSubmit(key, newName, newIngredients);
	},
	/* Recieves the key of the recipe to delete and passes it on to the deleteHandler of Box. */
	deleteHandler: function(key) {
		this.props.onDelete(key);
	},
	render: function() {
		/* passing this.handleClick directly to onClick props results in error... seems like scoping error. So it's stored in handler varialbe outside of the return statement..*/
		var handler = this.handleClick;
		/* Same issue with this.state. */
		var status = this.state;
		/* Same issue again. */
		var editSubmitHandler = this.editSubmit;
		/* Same issue again */
		var deleteHandler = this.deleteHandler;
		/* For each recipe, a list item is created using map function. All items are stored in recipeElements array. a call to RecipeDetails is placed to render the details of the recipe if its status is true. the status is passed with the call to RecipeDtails */ 
		var recipeElements = this.props.recipes.map(function(recipe){
			/* Bind returns a function with a body same as the function it's bound to. this is resolved to the first argument.
			So when you call it with onfilechange.bind(null, playsound), it creates and returns a new function, always receiving playsound as first argument and using global context (Because null is used as context), just like all regular functions use global context */
			return (
				<li key={recipe.key}><span onClick={handler.bind(null, recipe)}>{recipe.name}</span><RecipeDetails editSubmit={editSubmitHandler} status={status[recipe.key]} onDelete={deleteHandler} recipe={recipe} /></li>
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
	/* editForm controls the display of the edit form. Initially set to false. */
	getInitialState: function() {
		return ({editForm: false});
	},
	/* Edit button click handler, it sets the state of editForm to true which dislays the edit form on display. */
	handleEdit: function() {
		this.setState({editForm: true});
	},
	/* Cancel button handler, all it does is hide the edit form. */
	onCancel: function() {
		this.setState({editForm: false});	
	},
	/* Form submission handler, editForm is set to false to hide the form, it recieves edited recipe details and passes them to editSubmit handler is RecipeList. */
	onSubmit: function(key, newName, newIngredients) {
		this.setState({editForm: false});
		this.props.editSubmit(key, newName, newIngredients);
	},
	/* handler for delete button click. It calls deleteHandler in RecipeList passing the key of the clicked recipe. */
	deleteHandler: function() {
		this.props.onDelete(this.props.recipe.key);
	},
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
					<button className="edit" onClick={this.handleEdit}>Edit</button>
					<button className="delete" onClick={this.deleteHandler}>Delete</button>
					<EditRecipeForm status={this.state.editForm} recipe={this.props.recipe} onCancel={this.onCancel} onSubmit={this.onSubmit}/>
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

/* In this component, a recipe is edited. It renders two input fields loaded with current recipe name and ingredients, and save and cancel button. */
var EditRecipeForm = React.createClass({
	/* Cancel button handler, prevents reloading, and calls onCancel handler in RecipeDetails to set the state of editForm to false. */
	handleCancel: function(e) {
		e.preventDefault();
		this.props.onCancel();
	},
	/* Form submission handler. */
	submit: function(e) {
		e.preventDefault();
		/* Edited name and ingredients are saved, ingredients are trimmed at both ends. */
		var newName = $(".edit-recipe-name").val();
		var newIngredients = $(".edit-recipe-ingredients").val();
		newIngredients = newIngredients.split(",");
		for (var ingredient in newIngredients) {
			newIngredients[ingredient] = newIngredients[ingredient].trim();
		}
		/* The new details are passed to RecipeDetails onSubmit handler. These information are passed from here to RecipeDetails to RecipeList to Box. */
		this.props.onSubmit(this.props.recipe.key, newName, newIngredients);
	},
	/* Render method, first checks to see the state is true, if not, the form is not displayed. */
	render: function() {
		if (this.props.status) {
			return (
				<div>
					<div className="layer"></div>
					<form className="new-recipe-message" onSubmit={this.submit}>
						<h4>Edit recipe details</h4>
						<label for="edit-recipe-name">Recipe Name</label><br/>
						<input className="edit-recipe-name" defaultValue={this.props.recipe.name}></input><br/>
						<label for="edit-recipe-ingredients">Ingredients</label><br/>
						<input className="edit-recipe-ingredients" defaultValue={this.props.recipe.ingredients}/><br/>
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