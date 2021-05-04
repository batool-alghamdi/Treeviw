class nod {
    constructor(tag) {
        this.tag = tag
        this.children = []
        this.parent = null
        this.pos = { x: 0, y: 0 }
        this.r = 30
    }

    set position(position) {
        this.pos = position
    }
    set Parent(parent){
        this.parent = parent;
    }
    setChild(Child){
        this.children.push = Child;
    }

    get position() {
        return this.pos
    }

    get radius() {
        return this.r
    }

    


}