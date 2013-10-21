#!/usr/bin/python

f = open('bcm6348.elmt','w')

f.write("""<definition type="element" version="0.22" width="300" height="300" hotspot_x="150" hotspot_y="150" orientation="dyyy">
    <names>
        <name lang="en">Broadcom BCM6348 ADSL+ System-on-Chip</name>
    </names>
    <informations></informations>
    <description>
        <rect x="-135" y="-135" width="270" height="274" antialias="false" style="line-style:normal;line-weight:normal;filling:none;color:black"/>
        <rect x="-75" y="-75" width="150" height="150" antialias="false" style="line-style:normal;line-weight:normal;filling:none;color:black"/>
        <text x="-43" y="17" size="9" text="BCM6348KPB"/>
        <text x="-51" y="-8.33333" size="13" text="BROADCOM"/>
""")

#
# add terminals
#

# top
for y in range(5):
	for x in range(26):
		f.write('        <terminal x="'+str(-125+x*10)+'" y="'+str(-125+y*10)+'" orientation="n"/>\n')

# middle
for y in range(26-2*5):
	for x in range(5):
		f.write('        <terminal x="'+str(-125+x*10)+'" y="'+str(-135+6*10+y*10+2)+'" orientation="w"/>\n')
	for x in range(5):
		f.write('        <terminal x="'+str(135-5*10+x*10)+'" y="'+str(-135+6*10+y*10+2)+'" orientation="e"/>\n')

# bottom
for y in range(5):
	for x in range(26):
		f.write('        <terminal x="'+str(-125+x*10)+'" y="'+str(135-5*10+y*10+4)+'" orientation="s"/>\n')

#
# add numbering
#

# top
for i in range(5):
	f.write('        <text x="-150" y="'+str(-125+i*10+3)+'" size="5" text="'+str(i*26+1)+'"/>\n')
	f.write('        <text x="137" y="'+str(-125+i*10+3)+'" size="5" text="'+str((i+1)*26)+'"/>\n')

# middle (outside)
for y in range(26-2*5):
	f.write('        <text x="-150" y="'+str(-135+6*10+y*10+3)+'" size="5" text="'+str(131+y*10)+'"/>\n')
	f.write('        <text x="137" y="'+str(-135+6*10+y*10+3)+'" size="5" text="'+str(131+y*10+9)+'"/>\n')

# middle (inside)
for y in range(26-2*5-2):
	f.write('        <text x="-70" y="'+str(-135+6*10+10+y*10+3)+'" size="5" text="'+str(141+y*10+4)+'"/>\n')
	f.write('        <text x="58" y="'+str(-135+6*10+10+y*10+3)+'" size="5" text="'+str(141+y*10+5)+'"/>\n')

# bottom
for i in range(5):
	f.write('        <text x="-150" y="'+str(135-5*10+i*10+3)+'" size="5" text="'+str(291+i*26)+'"/>\n')
	f.write('        <text x="137" y="'+str(135-5*10+i*10+3)+'" size="5" text="'+str(291+i*26+25)+'"/>\n')

f.write("""    </description>
</definition>
""")

f.close()
