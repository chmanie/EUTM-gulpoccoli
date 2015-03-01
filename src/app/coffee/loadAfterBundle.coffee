class LegacyGreeter
  constructor: (@name) ->
  greet: () ->
    if window.veryImportantValue
      return 'Hello, ' + @name + ' \\/LLAP'
    else
      throw new Error 'Could not find very important value'


greeter = new LegacyGreeter('Kirk')

document.querySelector('#legacyGreet').textContent = greeter.greet()