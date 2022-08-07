package com.company;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("What is your Name?");
        String name = input.nextLine();
        System.out.printf("Your name is: %s", name);
    }
}