import java.util.*;
import java.io.*;
import java.awt.*;
import javax.swing.*;
public class Spaceship {
	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setBounds(10,10,1200,600);
		frame.getContentPane().add(new SpaceshipPanel());
		frame.setVisible(true);
	}
} class SpaceshipPanel extends JPanel {
	// assume planet is at (0,0)
	double 	M = 5.9737e24, 	// mass of planet (kg)
			X=-4000000, 	// X position of spaceship (m)
			Y=6000000,		// Y position of spaceship (m)
			V=4900,			// velocity of spaceship (m/s)
			A=220;			// angle of velocity (0 is right, 90 is up etc)
	double a, e, nu, n, period, posangle, GM;
	int time;
	public SpaceshipPanel() {
		GM = 6.67259e-11 * M; // G and M always multiplied in formulas
		A *= Math.PI/180; // angle in radians

		// step 1:
		// variables used in formula are r1 (distance to planet)
		double r1 = Math.sqrt(X*X+Y*Y);
		// v1 (initial velocity)
		double v1 = V;
		// gamma1 - this is the angle between the position and velocity - so we subtract the position angle from the velocity angle
		posangle = Math.atan2(Y,X);
		double gamma1 = A-posangle;
		if (gamma1<0) gamma1 += 2*Math.PI; // probably not necessary, just like positive angles
		double C = 2*GM/(r1*v1*v1); // calculating constant C used in 4.25
		// quadratic equation in 4.25 is basically px^2 + qx + r where p, q, r are..:
		double p = 1-C;
		double q = C;
		double r = -Math.sin(gamma1)*Math.sin(gamma1);
		// find two solutions to quadratic
		double R1 = r1*((-q + Math.sqrt(q*q-4*p*r))/(2*p));
		double R2 = r1*((-q - Math.sqrt(q*q-4*p*r))/(2*p));
		double Rp = Math.min(R1,R2); // smaller solution is periapsis radius, smallest distance
		double Ra = Math.max(R1,R2); // larger solution is apoapsis radius, largest distance
		// use formula 4.28 to find 'true anomaly', ie angle from planet to spaceship (where axes are aligned on ellipse)
		double val = (r1*v1*v1)/GM; // used multiple places in formula, so just temporary variable..
		nu = Math.atan2(val*Math.sin(gamma1)*Math.cos(gamma1),val*Math.sin(gamma1)*Math.sin(gamma1)-1); // true anomaly

		// a few other useful variables:

		a = (Rp + Ra)/2; // length of semi-major axis
		e = Math.sqrt((val-1)*(val-1)*Math.sin(gamma1)*Math.sin(gamma1)+Math.cos(gamma1)*Math.cos(gamma1)); // eccentricity calculated from 4.27
		n = Math.sqrt(GM/(a*a*a)); // (from 4.39)
		period = 2*Math.PI/n; // mean anomaly goes from 0 to 2pi, so this is period (based on 4.38)

		// for the animation, I've made it take a total time of 10 seconds regardless of how quick it really is, so finding position of spaceship at 1000 equally spaced variables - 0 * period, 1/1000 * period, 2/1000 * period, .., up to 999/1000 * period. First call getAngle to turn the time into a true anomaly, then then calculate a point on the ellipse based on that angle
		double[] tmp = new double[2];
		for (int i=0; i<1000; i++) {
			getPointOnEllipse(getAngle(i*period/1000),tmp);
			savex[i] = tmp[0];
			savey[i] = tmp[1];
		}

		time = 0;
		new java.util.Timer().scheduleAtFixedRate(new MyTimer(this),0,10);
	}
	void getPointOnEllipse(double angle,double[] ret) {
		double r = a*(1-e*e)/(1+e*Math.cos(angle)); // formula 4.43 gives us the distance from planet to spaceship given the true anomaly
		// need to do two adjustments to the angle - since we're doing everything relative to 'nu' ew subtract that off, then rotate everything by 'posangle' (the original angle to spaceship)
		// then we have actual position = r cos theta, r sin theta.
		ret[0] = r*Math.cos(angle-nu+posangle);
		ret[1] = r*Math.sin(angle-nu+posangle);
	}
	void drawLine(Graphics g, double x, double y, double x2, double y2) {
		double xx = 600+x/40000;
		double yy = 300-y/40000;
		double xx2 = 600+x2/40000;
		double yy2 = 300-y2/40000;
		g.drawLine((int)xx,(int)yy,(int)xx2,(int)yy2);
	}
	void drawPoint(Graphics g, double x, double y, double r) {
		double xx = 600+x/40000;
		double yy = 300-y/40000;
		g.fillOval((int)(xx-r),(int)(yy-r),(int)(2*r),(int)(2*r));
	}
	double solve(double M) {
		// solve E - e*sin E = M for E
		// newton-raphson would probably be the best method, but have just hacked together a quick binary search
		double low = -100, high = 100;
		for (int i=0; i<1000; i++) {
			double mid = (low+high)/2;
			double lhs = mid-e*Math.sin(mid);
			if (lhs<M) low=mid;
			else high = mid;
		}
		return (low+high)/2;
	}
	double getAngle(double time) {
		/*
		here i'm breaking away from the website a little bit, as its formula in 4.40 just uses cos,
		and there are two solutions in a full period when doing inverse cos - this led to only half
		of the orbit being calculated correctly. Instead, using the tan formula from http://en.wikipedia.org/wiki/Eccentric_anomaly
		so that I can use atan2
		*/
		double E0 = Math.atan2(Math.sqrt(1-e*e)*Math.sin(nu),e+Math.cos(nu)); // calculate initial eccentric anomaly - when the true anomaly is nu
		double M0 = E0 - e*Math.sin(E0); // calculate initial mean anomaly with 4.41
		double M = M0 + n*time;	// add on 'time' lots of n in 4.38
		double E = solve(M); // calculate what E value that correspond to by solving equation 4.41 in reverse. As mentioned there, this can't be done exactly, needs approximation methods
		double newnu = 2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2)); // again, using a tan formula to calculate the true anomaly from the eccentric anomaly - again from wikipedia page for tan (theta/2), though have split the right hand side up into sin / cos - found some other website that does the same thing, forget which
		return newnu;
	}
	double[] savex = new double[1000], savey = new double[1000];

	public void paintComponent(Graphics g) {
		super.paintComponent(g);
		g.setColor(Color.BLACK);
		drawPoint(g,0,0,5);
		double [] tmp = new double[2], tmp2 = new double[2];
		getPointOnEllipse(0,tmp);
		getPointOnEllipse(Math.PI,tmp2);
		drawLine(g,tmp[0],tmp[1],tmp2[0],tmp2[1]);
		g.setColor(Color.GREEN);
		getPointOnEllipse(Math.PI*0.5,tmp);
		getPointOnEllipse(Math.PI*1.5,tmp2);
		drawLine(g,tmp[0],tmp[1],tmp2[0],tmp2[1]);
		g.setColor(Color.BLACK);
		drawLine(g,X,Y,X+V*Math.cos(A)*500,Y+V*Math.sin(A)*500);
		g.setColor(Color.RED);

		for (int i=0; i<1000 && i<=time; i++) {
			drawPoint(g,savex[i],savey[i],1);
		}

		drawPoint(g,savex[time%1000],savey[time%1000],4);
	}
	void step() {
		time++;
	}
} class MyTimer extends TimerTask {
	SpaceshipPanel p;
	public MyTimer(SpaceshipPanel p) {
		this.p=p;
	}
	public void run() {
		p.step();
		p.repaint();
	}
}