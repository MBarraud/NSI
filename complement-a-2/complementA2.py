from tkinter import Tk, Canvas, Button, Frame, Scale
import tkinter.font as tkFont
from math import cos,sin,pi

class ComplementADeux(Tk):
    """ 
        Représentation du complément à 2 en
        entiers naturels ou relatif, ou en binaire.        
    """
    
    def __init__(self, n = 6, width = 600, height = 600):
        """ Initialisation de l'applicaiton """
        # Nombre de bit pour coder les entiers
        self.nbits = n
        # Nombre d'entiers codés
        self.nentiers = 2**self.nbits
        # Taille du canevas
        self.width, self.height = width, height
        # Epaisseur de la police de caractères
        self.epaisseur = 10
        self.type = 'binaire'
        self.selection = 5
        # Fenêtre de l'application
        Tk.__init__(self)
        self.title('Complément à 2')
        # Affichage
        self.figure = Canvas(self, width = self.width, height = self.height, bg ='white')
        self.figure.pack(fill="both", expand=True)
        self.creation_affichage()
        self.figure.bind('<Configure>', self.redim)
        self.outils = Frame(self)
        self.win = self.figure.create_window(self.width//2, self.height//2, width = 100, window = self.outils)   
        self.curseurNBits = Scale(self.outils, orient='horizontal', from_=1, to=8, resolution=1, length=100, label='Nb de bits', command = self.change_n)
        self.curseurNBits.set(self.nbits)
        self.curseurNBits.pack()
        self.curseurEpaisseur = Scale(self.outils, orient='horizontal', from_=1, to=40, resolution=1, length=100, label='Épaisseur', command = self.redim, showvalue = 0)
        self.curseurEpaisseur.set(self.epaisseur)
        self.curseurEpaisseur.pack()
        Button(self.outils, text='Binaire',width=100, command = lambda : self.affiche('binaire')).pack()
        Button(self.outils, text='Naturel',width=100, command = lambda : self.affiche('naturel')).pack()
        Button(self.outils, text='Relatif',width=100, command = lambda : self.affiche('relatif')).pack()
        # Le boucle d'attente des événements
        self.mainloop
            
    def coords(self,k,r=1):
        """ 
            Retourne les coordonnées de
            k : entier naturel dans [0 ; self.nentiers[ 
        """
        self.width = self.figure.winfo_width()
        self.height = self.figure.winfo_height()
        self.rayon = r*min(self.width//2-self.nbits*self.epaisseur//2,self.height//2-self.epaisseur)
        angle = (2*k+1)*pi/self.nentiers-pi/2
        x = self.width//2 + int(self.rayon * cos(angle))
        y = self.height//2 + int(self.rayon * sin(angle))
        return x,y
        
    def selectionne(self,event):
        """ Selection d'un entier """
        id = self.figure.find_closest (event.x, event.y)[0]
        if id in list(self.entiers):
            self.selection = list(self.entiers).index(id)
        self.redim(None)
                
    def change_n(self, event):
        """ Mise à jour du nombre de bits. """
        self.nbits = self.curseurNBits.get()
        self.nentiers = 2**self.nbits
        for i in range(len(self.entiers)):
            self.figure.delete(self.entiers[i])
        self.entiers = []
        mFont = tkFont.Font(family='Helvetica', size=self.epaisseur)
        for i in range(self.nentiers):
            self.entiers.append(self.figure.create_text(0,0,text = '+', font = mFont))
            self.figure.tag_bind(self.entiers[i],'<Button-1>', self.selectionne)
        self.affiche(self.type)
        self.redim(None)
        
    def creation_affichage(self):
        """ création des items de la figure pour afficher les valeurs. """
        self.fondp = self.figure.create_arc(0,0,0,0,width=1.2*self.epaisseur,outline='sky blue',start=-90,extent=180,style='arc')
        self.fondn = self.figure.create_arc(0,0,0,0,width=1.2*self.epaisseur,outline='pink',start=90,extent=180,style='arc')
        self.surligne = self.figure.create_polygon([(-1,-1)],fill = 'deep sky blue')
        mFont = tkFont.Font(family='Helvetica', weight='bold')
        self.plus1 = self.figure.create_text(0,0,text = '+1', font = mFont)#, fill='deep sky blue')
        self.non = self.figure.create_text(0,0,text = 'NON', font = mFont)
        mFont = tkFont.Font(family='Helvetica', size=self.epaisseur)
        self.entiers = []
        for i in range(self.nentiers):
            self.entiers.append(self.figure.create_text(0,0,text = '+', font = mFont))
            self.figure.tag_bind(self.entiers[i],'<Button-1>', self.selectionne)
        self.affiche(self.type)
        self.separe = self.figure.create_line(0,0,0,0,dash=(4, 4))
        
    def redim(self, event):
        """ 
            Mise à jour des coordonnées
            au dedimmensionnement de la figure.
        """
        self.epaisseur = self.curseurEpaisseur.get()
        mFont = tkFont.Font(family='Helvetica', size=self.epaisseur)
        for i in range(self.nentiers):
            self.figure.coords(self.entiers[i],*self.coords(i))
            self.figure.itemconfigure(self.entiers[i], font = mFont)
        self.figure.coords(self.separe,self.width//2,0,self.width//2,self.height)
        self.figure.coords(self.fondp,self.width*0.5-self.rayon, self.height*0.5-self.rayon,
                                self.width*0.5+self.rayon, self.height*0.5+self.rayon)
        self.figure.coords(self.fondn,self.width*0.5-self.rayon, self.height*0.5-self.rayon,
                                self.width*0.5+self.rayon, self.height*0.5+self.rayon)
        self.figure.itemconfigure(self.fondp, width = (self.nbits-1)*self.epaisseur)
        self.figure.itemconfigure(self.fondn, width = (self.nbits-1)*self.epaisseur)
        self.figure.coords(self.win,self.width//2, self.height//2)
        x1 , y1 = self.coords(self.selection)
        x2 , y2 = self.coords(self.nentiers-self.selection-1)
        decale = 2*self.epaisseur
        if self.selection < self.nentiers//2:
            decale = - decale
        x1 = x1 + decale 
        x2 = x2 - decale
        self.figure.coords (self.non, self.width//2, y1)
        self.figure.coords (self.surligne, x1, y1 - self.epaisseur,
                                           x1, y1 + self.epaisseur,
                                           x2 - decale, y2 + self.epaisseur,
                                           x2 - decale, y2 + 2*self.epaisseur,
                                           x2, y2,
                                           x2 - decale, y2 - 2*self.epaisseur,
                                           x2 - decale, y2 - self.epaisseur)
        self.figure.coords (self.plus1,*self.coords(self.nentiers-self.selection-0.5))

    def affiche(self,type):
        """ Modifie l'affichage des entier selon le type souhaité.
            'nat' : entiers naturels
            'rel' : entiers relatifs
            'bin' : représentation binaire
        """
        self.type = type
        if self.type == 'binaire':
            texte = [str(bin(i))[2:].zfill(self.nbits)  for i in range(0,self.nentiers)]
        elif self.type == 'naturel':
            texte = [str(i) for i in range(0,self.nentiers)]
        elif self.type == 'relatif':
            texte = [str(i) if i<self.nentiers/2 else str(i-self.nentiers) for i in range(0,self.nentiers)]
        for i in range(0,self.nentiers):
            self.figure.itemconfigure(self.entiers[i], text=texte[i])

if __name__ == "__main__":
    go = ComplementADeux(4,400,400)
