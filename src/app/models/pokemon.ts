class Pokemon{
    private _name: string = "";
    private _id: string = "";
    private _description: string = "";
    private _height: string = "";
    private _weight: string = "";
    private _category: string = "";
    private _gender: string = "";
    private _habitat: string = "";
    private _color: string = "";
    private _types: any[] = [];
    private _evolution: any[] = [];
    private _picture: string = "";

    constructor(name: string,id: string, description: string, height: string, weight: string, category: string, gender: string, habitat: string, color: string, types: any[], evolution: any[], picture: any){
        this._name = name;
        this._id = id;
        this._description = description;
        this._height = height;
        this._weight = weight;
        this._category = category;
        this._gender = gender;
        this._habitat = habitat;
        this._color = color;
        this._types = types;
        this._evolution = evolution;
        this._picture = picture;
    }
    
    public get name() {
        return this._name;
    }
    public get id() {
        return this._id;
    }
    public get description() {
        return this._description;
    }
    public get height() {
        return this._height;
    }
    public get weight() {
        return this._weight;
    }
    public get category() {
        return this._category;
    }
    public get gender() {
        return this._gender;
    }
    public get habitat() {
        return this._habitat;
    }
    public get color() {
        return this._color;
    }
    public get types() {
        return this._types;
    }
    public get evolution() {
        return this._evolution;
    }
    public get picture() {
        return this._picture;
    }
}

export {Pokemon};