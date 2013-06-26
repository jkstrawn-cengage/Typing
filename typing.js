var Manager = function() {
	return {
		wordList: [],
		wordObject: new Word(''),
		numberOfUnusedWords: 0,

		//functions
		getWord: function() {
			return this.wordObject.word;
		},

		setWordList: function(list) {
			this.wordList = list;
			this.numberOfUnusedWords = list.length;
		},

		getRandomWordFromList: function() {
			var index = Math.floor(Math.random() * this.numberOfUnusedWords);
			var word = this.wordList[index]
			this.moveWordToEndOfList(index);
			this.numberOfUnusedWords--;
			if (this.numberOfUnusedWords < 0) {
				this.numberOfUnusedWords = this.wordList.length;
			}
			return word;
		},

		moveWordToEndOfList: function(index) {
			var word = this.wordList[index];
			this.wordList.splice(index, 1);
			this.wordList.push(word);
		},

		setNewWord: function() {
			var word = this.getRandomWordFromList();
			this.wordObject = new Word(word, this);
			return word;
		},

		acceptKey: function(key) {
			var accepted = this.wordObject.acceptKey(key);
			return accepted;
		}
	};
};

var Word = function(_word, _manager) {
	return {
		word: _word,
		manager: _manager,
		position: 0,

		//functions
		acceptKey: function(inputKey) {
			var nextKey = this.word[this.position];
			if (inputKey == nextKey) {
				this.position++;
				if (this.isWordCompleted()) {
					this.manager.setNewWord();
				}
				return true;
			}
			return false;
		},

		isWordCompleted: function() {
			return (this.position >= this.word.length);
		}
	};
};

describe('typing', function() {
	var manager;

	beforeEach(function() {
		manager = new Manager();
		manager.setWordList(['unicorn', 'goblin', 'gremlin', 'troll', 'dragon']);
		manager.setNewWord();
	});

	it('creates a manager with a current word that is empty', function() {
		manager = new Manager();
		expect(manager.getWord()).toEqual('');
	});

	it('has a list of words after the list is assigned', function() {
		manager.setWordList(['unicorn', 'goblin', 'gremlin', 'troll', 'dragon']);
		expect(manager.wordList).toEqual(['unicorn', 'goblin', 'gremlin', 'troll', 'dragon']);
	});

	it('gets a random word from the list after the list is added', function() {
		expect(manager.getRandomWordFromList().length).toBeTruthy();
	});

	it('has a random word set when setWord is called', function() {
		expect(manager.getWord().length).toBeTruthy();
	});

	it('returns true when the manager accepts the correct next key', function() {
		var word = manager.getWord();
		var correctNextKey = word[0];
		expect(manager.acceptKey(correctNextKey)).toBeTruthy();
	});

	it('returns false when the manager accepts the incorrect next key', function() {
		expect(manager.acceptKey('a')).toBeFalsy();
	});

	it('accepts all the keys for the current word', function() {
		var word = manager.getWord();
		for (var i = 0; i < word.length; i++) {
			expect(manager.acceptKey(word[i])).toBeTruthy();
		};
	});
	it('has a new word after the first word is completed', function() {
		var word = manager.getWord();
		for (var i = 0; i < word.length; i++) {
			manager.acceptKey(word[i]);
		};
		expect(manager.getWord()).not.toEqual(word);
	});
	it('does not repeat words', function() {
		var usedWords = [];
		for (var k = 0; k < 5; k++) {
			var newWord = manager.getWord();
			//check to make sure its not is our used words array
			for (var j = usedWords.length - 1; j >= 0; j--) {
				expect(usedWords[j]).not.toEqual(newWord);
			};
			//complete a word
			for (var i = 0; i < newWord.length; i++) {
				manager.acceptKey(newWord[i]);
			};
			usedWords.push(newWord);
		}
	});
});