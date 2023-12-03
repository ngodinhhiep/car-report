import { InjectRepository } from "@nestjs/typeorm";
import { Between, LessThan, Repository } from "typeorm";
import { Car } from "./car.entity";
import { User } from "../users/user.entity";
import { CreateCarDto } from "./dtos/create-car.dto";
import { UpdateCarDto } from "./dtos/update-car.dto";
import { NotFoundException } from "@nestjs/common";
import { Like } from "typeorm";

export class CarsService {
    constructor(@InjectRepository(Car) private repository: Repository<Car>) {} 

    // View all cars information
    getAllCarsInfo(): Promise<Car[]> {
        return this.repository.find(); // find all the car objects 
    }

    // Admin creates cars 
    createCar(importedBody: CreateCarDto, user: User, photo: Express.Multer.File) {
        const newCar = this.repository.create(importedBody);
        newCar.user = user;
        newCar.photo = photo.filename;
        return this.repository.save(newCar);
    }


    // Find a car by its Id
    findOneCarByItsId(id: number) {
        if(!id) {
            throw new NotFoundException('Car not found')
        } 
        return this.repository.findOneBy({ id: id}); // return a car of that id
    } 


    // Admin updates cars by its Id found
    async updateCar(id: number, updateInfo: Partial<UpdateCarDto>, photo: Express.Multer.File) {
        const updatedCar = await this.findOneCarByItsId(id);
        updatedCar.name = updateInfo.name || updatedCar.name;
        updatedCar.maker = updateInfo.maker || updatedCar.maker;
        updatedCar.price = updateInfo.price || updatedCar.price;

        // if photo is uploaded, updatedCar.photo = photo.filename, if no it retains its original photo property
        updatedCar.photo = photo ? photo.filename : updatedCar.photo; 

  return this.repository.save(updatedCar);
    }


    // Admin deletes cars
    async deleteCar(id: number) {
        const deletedCar = await this.findOneCarByItsId(id);
        return this.repository.remove(deletedCar);
    }


      // users Search cars by name
      searchCarsByName (searchQuery: string): Promise<Car[]> {
        const carSearched = this.repository.find({ where: { name: Like(`%${searchQuery}%`) } });
        return carSearched;
    }

    // users Search cars by maker
    searchCarsByMaker (searchQuery: string): Promise<Car[]> {
        const carSearched = this.repository.find({ where: { maker: Like(`%${searchQuery}%`) } });
        return carSearched;
    }

    // users Search cars by price
    searchCarsByPrice (fromPrice: number, toPrice: number): Promise<Car[]> {
        
        const carSearched = this.repository.find({ where: { price: Between(fromPrice, toPrice) } });
        return carSearched;
    }
}