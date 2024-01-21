
### Some major benefits:

Gain an overview of the keywords and their distribution throughout the document, in the order of their occurrence during the discourse. 

Take a closer look at sentences containing the keyword of interest by hovering over the hit marks. 

Temporarily pin the sentence preview window with a click. 

Switch to the main text around the sentence of interest with another click.


### A simple walk-through:

Serve your folder of PDFs with Flask like this: 

`python app.py /your/path/of/pdfs`

Go to `http://127.0.0.1:5000` to find a list of your PDF files.

Click on one of the files, and a new page will open to compute and then draw bars with hit marks.

![694606f8a23de34ef4860e558b809f2](https://github.com/allen7u/PDF.svg/assets/81082384/75f92454-2b23-4876-85bc-14c96407c795)

Click a bar with a keyword of your interest and a new bar will be drawn.

![44f2c9f82a5a239e5610d66c90c4b80](https://github.com/allen7u/PDF.svg/assets/81082384/f2e0ba68-937c-4ab4-aeb5-cc8e04ae105b)

At this point, you can either hover over hit marks on the newly drawn bar to preview the full sentences containing that keyword.

Or you can specify a range and zoom into it by specifying the start and end locations on the bar that you clicked before, each with a single click.

After finding one or more sentences of your interest during previewing by hovering, left-click, and the preview window will be fixed.

Then, a click on the sentence will bring you to the page where that sentence is from with highlighting at the start and end of the sentence.

![f4c750314fb501f69000c9b819174cc](https://github.com/allen7u/PDF.svg/assets/81082384/30a7a066-1559-4725-9a7b-e347c3d9639a)

That's about it. Remember that you can cancel the PDF reader view or the fixed preview window of sentences with the ESC key.

To remove newly generated bars of keywords, click the orange text to the left of it.


### Known limitations:

Computing keywords with the so-called mutual enrichment technique will take up to one or two hours for a very long PDF book the first time. 

The result will be cached, so when you read that book another time, it won't go through the keyword computing step again.

For unknown reasons, the progress counting will progressively become faster. 


### Improvement:

As you can see, my current skills and knowledge in software engineering, industry, and best practices are limited. If you have plans for business collaboration, intend to establish and maintain a series of open-source academic tools, or have some general suggestions, feel free to start a discussion or send me a direct message (D.M.).

![image](https://github.com/allen7u/PDF.svg/assets/81082384/a4eea588-a62a-40ff-9f44-b6769398a064)
